import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { sendEmail } from "./emailService";
import {
  insertTenantSchema,
  insertCustomerSchema,
  insertTicketSchema,
  insertTicketCommentSchema,
  insertHourBankSchema,
  insertTimeEntrySchema,
  insertArticleSchema,
  insertDepartmentSchema,
  insertCategorySchema,
  updateTenantBrandingSchema,
} from "@shared/schema";

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
  cnpj: z.string().optional(),
  planType: z.enum(['free', 'pro', 'enterprise']),
  departments: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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
        cnpj: data.cnpj,
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

      res.json({ tenant, success: true });
    } catch (error) {
      console.error("Onboarding error:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
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
      res.json({
        subscriptionId: subscription.id,
        clientSecret: latestInvoice?.payment_intent?.client_secret,
        customerId: customer.id,
      });
    } catch (error: any) {
      console.error("Onboarding subscription error:", error);
      res.status(500).json({ message: error.message });
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
      res.json({
        subscriptionId: subscription.id,
        clientSecret: latestInvoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription error:", error);
      res.status(500).json({ message: error.message });
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
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
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
      res.json(customers);
    } catch (error) {
      console.error("Customers fetch error:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
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
      res.json(customer);
    } catch (error) {
      console.error("Customer creation error:", error);
      res.status(500).json({ message: "Failed to create customer" });
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
      res.json(tickets);
    } catch (error) {
      console.error("Tickets fetch error:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
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

      res.json(ticket);
    } catch (error) {
      console.error("Ticket creation error:", error);
      res.status(500).json({ message: "Failed to create ticket" });
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

      res.json({ ticket, comments, timeEntries });
    } catch (error) {
      console.error("Ticket fetch error:", error);
      res.status(500).json({ message: "Failed to fetch ticket" });
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
      res.json(ticket);
    } catch (error) {
      console.error("Ticket update error:", error);
      res.status(500).json({ message: "Failed to update ticket" });
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
      res.json(comment);
    } catch (error) {
      console.error("Comment creation error:", error);
      res.status(500).json({ message: "Failed to create comment" });
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
      res.json(hourBanks);
    } catch (error) {
      console.error("Hour banks fetch error:", error);
      res.status(500).json({ message: "Failed to fetch hour banks" });
    }
  });

  app.post('/api/hour-banks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertHourBankSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
      });

      const hourBank = await storage.createHourBank(data);
      res.json(hourBank);
    } catch (error) {
      console.error("Hour bank creation error:", error);
      res.status(500).json({ message: "Failed to create hour bank" });
    }
  });

  // Time entries
  app.post('/api/time-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const data = insertTimeEntrySchema.parse({
        ...req.body,
        userId,
      });

      const timeEntry = await storage.createTimeEntry(data);
      res.json(timeEntry);
    } catch (error) {
      console.error("Time entry creation error:", error);
      res.status(500).json({ message: "Failed to create time entry" });
    }
  });

  app.patch('/api/time-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const timeEntry = await storage.updateTimeEntry(req.params.id, req.body);
      res.json(timeEntry);
    } catch (error) {
      console.error("Time entry update error:", error);
      res.status(500).json({ message: "Failed to update time entry" });
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
      res.json(articles);
    } catch (error) {
      console.error("Articles fetch error:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
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
      res.json(article);
    } catch (error) {
      console.error("Article creation error:", error);
      res.status(500).json({ message: "Failed to create article" });
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

      res.json({
        customBranding: tenant.customBranding || {},
        tenantName: tenant.name,
      });
    } catch (error) {
      console.error("Get branding error:", error);
      res.status(500).json({ message: "Failed to fetch branding" });
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

      res.json({
        customBranding: updatedTenant.customBranding,
        message: "Branding updated successfully"
      });
    } catch (error) {
      console.error("Update branding error:", error);
      res.status(500).json({ message: "Failed to update branding" });
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

      res.json({
        logoUrl,
        message: "Logo uploaded successfully"
      });
    } catch (error) {
      console.error("Logo upload error:", error);
      res.status(500).json({ message: "Failed to upload logo" });
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
      res.json(departments);
    } catch (error) {
      console.error("Departments fetch error:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
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
      res.json(categories);
    } catch (error) {
      console.error("Categories fetch error:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
