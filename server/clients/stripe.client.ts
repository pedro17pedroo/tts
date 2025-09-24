import Stripe from "stripe";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as any,
  });
} else {
  console.warn("STRIPE_SECRET_KEY environment variable not set. Payment features will be disabled.");
}

export { stripe };

export class StripeClient {
  private stripe: Stripe | null;

  constructor() {
    this.stripe = stripe;
  }

  isAvailable(): boolean {
    return this.stripe !== null;
  }

  getClient(): Stripe {
    if (!this.stripe) {
      throw new Error("Stripe is not configured");
    }
    return this.stripe;
  }

  async createCustomer(data: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }) {
    if (!this.stripe) {
      throw new Error("Stripe is not configured");
    }
    return this.stripe.customers.create(data);
  }

  async createSubscription(data: {
    customer: string;
    items: { price: string }[];
    payment_behavior?: 'default_incomplete' | 'allow_incomplete' | 'error_if_incomplete' | 'pending_if_incomplete';
    expand?: string[];
    metadata?: Record<string, string>;
  }) {
    if (!this.stripe) {
      throw new Error("Stripe is not configured");
    }
    return this.stripe.subscriptions.create(data);
  }

  async retrieveSubscription(subscriptionId: string) {
    if (!this.stripe) {
      throw new Error("Stripe is not configured");
    }
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }
}