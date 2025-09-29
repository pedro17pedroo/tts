import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { sendEmail } from "./emailService";
import {
  updateTenantBrandingSchema,
} from "./schema";
import { emailRoutes } from "./modules/email/routes";

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as any,
  });
} else {
  console.warn("STRIPE_SECRET_KEY environment variable not set. Payment features will be disabled.");
}

const onboardingSchema = z.object({
  tenantName: z.string().min(1),
  nif: z.string().min(1, "NIF é obrigatório"),
  planType: z.enum(['free', 'pro', 'enterprise']),
  departments: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
});

// Schemas simples para validação
const insertCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  tenantId: z.string(),
});

const insertTicketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  customerId: z.string(),
  departmentId: z.string().optional(),
  categoryId: z.string().optional(),
  tenantId: z.string(),
});

const insertTicketCommentSchema = z.object({
  content: z.string().min(1),
  isInternal: z.boolean().default(false),
  ticketId: z.string(),
  authorId: z.string(),
});

const insertHourBankSchema = z.object({
  customerId: z.string(),
  totalHours: z.string(),
  hourlyRate: z.string().optional(),
  expiresAt: z.string().optional(),
  tenantId: z.string(),
});

const insertTimeEntrySchema = z.object({
  ticketId: z.string(),
  userId: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
  hourBankId: z.string().optional(),
});

const insertArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  isPublic: z.boolean().default(false),
  categoryId: z.string().optional(),
  tenantId: z.string(),
  authorId: z.string(),
});

const updateLocaleSettingsSchema = z.object({
  locale: z.enum(['pt-AO', 'pt-BR', 'en-US', 'es-ES']),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tenant onboarding
  app.post('/api/onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userClaims = req.user;
      const data = onboardingSchema.parse(req.body);

      // Create tenant
      const tenant = await storage.createTenant({
        name: data.tenantName,
        nif: data.nif,
        planType: data.planType,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
      });

      // Update user to be tenant admin
      await storage.upsertUser({
        id: userId,
        email: userClaims.email,
        firstName: userClaims.firstName,
        lastName: userClaims.lastName,
        profileImageUrl: userClaims.profileImageUrl,
        role: 'tenant_admin',
        tenantId: tenant.id,
      });

      // Create default departments
      const defaultDepartments = data.departments?.length 
        ? data.departments 
        : ['Support', 'Sales'];
      
      for (const name of defaultDepartments) {
        await storage.createDepartment({
          name,
          tenantId: tenant.id,
        });
      }

      // Create default categories
      const defaultCategories = data.categories?.length 
        ? data.categories 
        : ['Bug/Error', 'Request', 'Question'];
      
      for (const name of defaultCategories) {
        await storage.createCategory({
          name,
          tenantId: tenant.id,
        });
      }

      return res.json({ tenant, success: true });
    } catch (error) {
      console.error("Onboarding error:", error);
      return res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Onboarding subscription (before tenant exists)
  app.post('/api/onboarding-subscription', isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is currently unavailable" });
      }

      const userId = req.user.id;
      const userClaims = req.user;
      const { planType } = req.body;

      if (!planType || (planType !== 'pro' && planType !== 'enterprise')) {
        return res.status(400).json({ message: "Invalid plan type" });
      }

      if (!userClaims.email) {
        return res.status(400).json({ message: 'User email required' });
      }

      const priceIds = {
        pro: process.env.STRIPE_PRO_PRICE_ID,
        enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      };

      const priceId = priceIds[planType as keyof typeof priceIds];
      if (!priceId) {
        return res.status(400).json({ message: "Price ID not configured for plan" });
      }

      // Create temporary customer for onboarding
      const customer = await stripe.customers.create({
        email: userClaims.email,
        name: `${userClaims.firstName} ${userClaims.lastName}`,
        metadata: {
          userId,
          planType,
          isOnboarding: 'true'
        }
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          planType,
          isOnboarding: 'true'
        }
      });

      const latestInvoice = subscription.latest_invoice as any;
      return res.json({
        subscriptionId: subscription.id,
        clientSecret: latestInvoice?.payment_intent?.client_secret,
        customerId: customer.id,
      });
    } catch (error: any) {
      console.error("Onboarding subscription error:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  // Subscription management
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is currently unavailable" });
      }

      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User must complete onboarding first" });
      }

      const tenant = await storage.getTenant(user.tenantId);
      if (!tenant) {
        return res.status(400).json({ message: "Tenant not found" });
      }

      if (tenant.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(tenant.stripeSubscriptionId);
        const latestInvoice = subscription.latest_invoice as any;
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: latestInvoice?.payment_intent?.client_secret,
        });
      }

      if (!user.email) {
        throw new Error('No user email on file');
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      await storage.updateTenant(tenant.id, {
        stripeCustomerId: customer.id,
      });

      const priceIds = {
        pro: process.env.STRIPE_PRO_PRICE_ID,
        enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      };

      const priceId = priceIds[tenant.planType as keyof typeof priceIds];
      if (!priceId) {
        return res.status(400).json({ message: "Invalid plan type" });
      }

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateTenant(tenant.id, {
        stripeSubscriptionId: subscription.id,
      });

      const latestInvoice = subscription.latest_invoice as any;
      return res.json({
        subscriptionId: subscription.id,
        clientSecret: latestInvoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription error:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const stats = await storage.getDashboardStats(user.tenantId);
      return res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Customers
  app.get('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const customers = await storage.getCustomersByTenant(user.tenantId);
      return res.json(customers);
    } catch (error) {
      console.error("Customers fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertCustomerSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
      });

      const customer = await storage.createCustomer(data);
      return res.json(customer);
    } catch (error) {
      console.error("Customer creation error:", error);
      return res.status(500).json({ message: "Failed to create customer" });
    }
  });

  // Tickets
  app.get('/api/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const filters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        assigneeId: req.query.assigneeId as string,
      };

      const tickets = await storage.getTicketsByTenant(user.tenantId, filters);
      return res.json(tickets);
    } catch (error) {
      console.error("Tickets fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.post('/api/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertTicketSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
      });

      const ticket = await storage.createTicket(data);

      // Send notification email
      try {
        const customer = await storage.getCustomer(ticket.customerId, user.tenantId);
        if (customer?.email) {
          await sendEmail({
            to: customer.email,
            subject: `New Ticket Created: ${ticket.title}`,
            html: `
              <h2>Your ticket has been created</h2>
              <p><strong>Ticket ID:</strong> #${ticket.id}</p>
              <p><strong>Title:</strong> ${ticket.title}</p>
              <p><strong>Status:</strong> ${ticket.status}</p>
              <p><strong>Priority:</strong> ${ticket.priority}</p>
            `,
          });
        }
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }

      return res.json(ticket);
    } catch (error) {
      console.error("Ticket creation error:", error);
      return res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  app.get('/api/tickets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const ticket = await storage.getTicket(req.params.id, user.tenantId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const comments = await storage.getTicketComments(ticket.id);
      const timeEntries = await storage.getTimeEntriesByTicket(ticket.id);

      return res.json({ ticket, comments, timeEntries });
    } catch (error) {
      console.error("Ticket fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  app.patch('/api/tickets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const ticket = await storage.updateTicket(req.params.id, req.body);
      return res.json(ticket);
    } catch (error) {
      console.error("Ticket update error:", error);
      return res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  // Ticket comments
  app.post('/api/tickets/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertTicketCommentSchema.parse({
        ...req.body,
        ticketId: req.params.id,
        authorId: userId,
      });

      const comment = await storage.createTicketComment(data);
      return res.json(comment);
    } catch (error) {
      console.error("Comment creation error:", error);
      return res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Hour banks
  app.get('/api/hour-banks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const hourBanks = await storage.getHourBanksByTenant(user.tenantId);
      return res.json(hourBanks);
    } catch (error) {
      console.error("Hour banks fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch hour banks" });
    }
  });

  app.post('/api/hour-banks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const validatedData = insertHourBankSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
      });

      const hourBankData = {
        ...validatedData,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      };

      const hourBank = await storage.createHourBank(hourBankData);
      return res.json(hourBank);
    } catch (error) {
      console.error("Hour bank creation error:", error);
      return res.status(500).json({ message: "Failed to create hour bank" });
    }
  });

  // Time entries
  app.post('/api/time-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertTimeEntrySchema.parse({
        ...req.body,
        userId,
      });

      const timeEntryData = {
        ...validatedData,
        startTime: new Date(validatedData.startTime),
        endTime: validatedData.endTime ? new Date(validatedData.endTime) : undefined,
      };

      const timeEntry = await storage.createTimeEntry(timeEntryData);
      return res.json(timeEntry);
    } catch (error) {
      console.error("Time entry creation error:", error);
      return res.status(500).json({ message: "Failed to create time entry" });
    }
  });

  app.patch('/api/time-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const timeEntry = await storage.updateTimeEntry(req.params.id, req.body);
      return res.json(timeEntry);
    } catch (error) {
      console.error("Time entry update error:", error);
      return res.status(500).json({ message: "Failed to update time entry" });
    }
  });

  // Knowledge base
  app.get('/api/articles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const isPublic = req.query.public === 'true' ? true : undefined;
      const articles = await storage.getArticlesByTenant(user.tenantId, isPublic);
      return res.json(articles);
    } catch (error) {
      console.error("Articles fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.post('/api/articles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertArticleSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
        authorId: userId,
      });

      const article = await storage.createArticle(data);
      return res.json(article);
    } catch (error) {
      console.error("Article creation error:", error);
      return res.status(500).json({ message: "Failed to create article" });
    }
  });

  // Tenant customization endpoints
  app.get('/api/tenant/branding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const tenant = await storage.getTenant(user.tenantId);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }

      return res.json({
        customBranding: tenant.customBranding || {},
        tenantName: tenant.name,
      });
    } catch (error) {
      console.error("Get branding error:", error);
      return res.status(500).json({ message: "Failed to fetch branding" });
    }
  });

  app.put('/api/tenant/branding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      if (user.role !== 'tenant_admin') {
        return res.status(403).json({ message: "Only tenant admins can update branding" });
      }

      const { customBranding } = updateTenantBrandingSchema.parse(req.body);

      const updatedTenant = await storage.updateTenant(user.tenantId, {
        customBranding,
      });

      return res.json({
        customBranding: updatedTenant.customBranding,
        message: "Branding updated successfully"
      });
    } catch (error) {
      console.error("Update branding error:", error);
      return res.status(500).json({ message: "Failed to update branding" });
    }
  });

  app.post('/api/tenant/logo-upload', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      if (user.role !== 'tenant_admin') {
        return res.status(403).json({ message: "Only tenant admins can upload logos" });
      }

      const { logoData, fileName } = req.body;
      
      if (!logoData || !fileName) {
        return res.status(400).json({ message: "Logo data and file name required" });
      }

      // For now, we'll store base64 data directly
      // In production, you'd upload to cloud storage
      const logoUrl = logoData;

      const tenant = await storage.getTenant(user.tenantId);
      const currentBranding = tenant?.customBranding || {};

      const updatedTenant = await storage.updateTenant(user.tenantId, {
        customBranding: {
          ...currentBranding,
          logo: logoUrl,
        },
      });

      return res.json({
        logoUrl,
        message: "Logo uploaded successfully"
      });
    } catch (error) {
      console.error("Logo upload error:", error);
      return res.status(500).json({ message: "Failed to upload logo" });
    }
  });

  // Tenant locale settings endpoints
  app.get('/api/tenant/locale-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const tenant = await storage.getTenant(user.tenantId);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }

      // Return the tenant's locale setting or default to 'pt-AO'
      return res.json({
        locale: tenant.locale || 'pt-AO',
      });
    } catch (error) {
      console.error("Get locale settings error:", error);
      return res.status(500).json({ message: "Failed to fetch locale settings" });
    }
  });

  app.put('/api/tenant/locale-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      if (user.role !== 'tenant_admin') {
        return res.status(403).json({ message: "Only tenant admins can update locale settings" });
      }

      const { locale } = updateLocaleSettingsSchema.parse(req.body);

      const updatedTenant = await storage.updateTenant(user.tenantId, {
        locale,
      });

      return res.json({
        locale: updatedTenant.locale,
        message: "Locale settings updated successfully"
      });
    } catch (error) {
      console.error("Update locale settings error:", error);
      return res.status(500).json({ message: "Failed to update locale settings" });
    }
  });

  // Departments
  app.get('/api/departments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const departments = await storage.getDepartmentsByTenant(user.tenantId);
      return res.json(departments);
    } catch (error) {
      console.error("Departments fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  // Categories
  app.get('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const categories = await storage.getCategoriesByTenant(user.tenantId);
      return res.json(categories);
    } catch (error) {
      console.error("Categories fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Email routes
  app.use('/api/email', emailRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
