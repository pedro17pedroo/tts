import { z } from "zod";
import { type Request } from "express";
import type { Tenant, InsertTenant } from "@shared/schema";

export type TenantData = Tenant;
export type CreateTenantData = InsertTenant;

// Request types
export interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_image_url: string;
    };
  };
}

// Schema for onboarding
export const onboardingSchema = z.object({
  tenantName: z.string().min(1),
  cnpj: z.string().optional(),
  planType: z.enum(['free', 'pro', 'enterprise']),
  departments: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

// Response types
export interface OnboardingResponse {
  tenant: TenantData;
  success: boolean;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  clientSecret?: string;
  customerId?: string;
}