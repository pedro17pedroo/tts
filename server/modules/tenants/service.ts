import { TenantsRepository } from "./repository";
import { StripeClient } from "../../clients/stripe.client";
import type { OnboardingData, TenantData, SubscriptionData } from "./types";
import type { User } from "@shared/schema";

export class TenantsService {
  private repository: TenantsRepository;
  private stripeClient: StripeClient;

  constructor() {
    this.repository = new TenantsRepository();
    this.stripeClient = new StripeClient();
  }

  async completeTenantOnboarding(data: OnboardingData, user: User): Promise<TenantData> {
    // Create tenant
    const tenant = await this.repository.createTenant({
      name: data.tenantName,
      nif: data.nif,
      planType: data.planType,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
    });

    // Create default departments
    const defaultDepartments = data.departments?.length 
      ? data.departments 
      : ['Support', 'Sales'];
    
    for (const name of defaultDepartments) {
      await this.repository.createDepartment({
        name,
        tenantId: tenant.id,
      });
    }

    // Create default categories
    const defaultCategories = data.categories?.length 
      ? data.categories 
      : ['Bug/Error', 'Request', 'Question'];
    
    for (const name of defaultCategories) {
      await this.repository.createCategory({
        name,
        tenantId: tenant.id,
      });
    }

    return tenant;
  }

  async createOnboardingSubscription(
    planType: string,
    user: any,
    tenantName: string
  ): Promise<SubscriptionData> {
    if (!this.stripeClient.isAvailable()) {
      throw new Error("Payment processing is currently unavailable");
    }

    if (!planType || (planType !== 'pro' && planType !== 'enterprise')) {
      throw new Error("Invalid plan type");
    }

    if (!user.email) {
      throw new Error('User email required');
    }

    const priceIds = {
      pro: process.env.STRIPE_PRO_PRICE_ID,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    };

    const priceId = priceIds[planType as keyof typeof priceIds];
    if (!priceId) {
      throw new Error("Price ID not configured for plan");
    }

    // Create temporary customer for onboarding
    const customer = await this.stripeClient.createCustomer({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user.id,
        planType,
        isOnboarding: 'true'
      }
    });

    const subscription = await this.stripeClient.createSubscription({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user.id,
        planType,
        isOnboarding: 'true'
      }
    });

    const latestInvoice = subscription.latest_invoice as any;
    return {
      subscriptionId: subscription.id,
      clientSecret: latestInvoice?.payment_intent?.client_secret,
      customerId: customer.id,
    };
  }

  async createSubscription(user: User): Promise<SubscriptionData> {
    if (!this.stripeClient.isAvailable()) {
      throw new Error("Payment processing is currently unavailable");
    }

    if (!user?.tenantId) {
      throw new Error("User must complete onboarding first");
    }

    const tenant = await this.repository.getTenant(user.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }

    if (tenant.stripeSubscriptionId) {
      const subscription = await this.stripeClient.retrieveSubscription(tenant.stripeSubscriptionId);
      const latestInvoice = subscription.latest_invoice as any;
      return {
        subscriptionId: subscription.id,
        clientSecret: latestInvoice?.payment_intent?.client_secret,
      };
    }

    if (!user.email) {
      throw new Error('No user email on file');
    }

    const customer = await this.stripeClient.createCustomer({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    await this.repository.updateTenant(tenant.id, {
      stripeCustomerId: customer.id,
    });

    const priceIds = {
      pro: process.env.STRIPE_PRO_PRICE_ID,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    };

    const priceId = priceIds[tenant.planType as keyof typeof priceIds];
    if (!priceId) {
      throw new Error("Invalid plan type");
    }

    const subscription = await this.stripeClient.createSubscription({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    await this.repository.updateTenant(tenant.id, {
      stripeSubscriptionId: subscription.id,
    });

    const latestInvoice = subscription.latest_invoice as any;
    return {
      subscriptionId: subscription.id,
      clientSecret: latestInvoice?.payment_intent?.client_secret,
    };
  }
}