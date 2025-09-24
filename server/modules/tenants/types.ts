import { z } from "zod";
import type { Tenant, InsertTenant } from "@shared/schema";
import type { 
  AuthenticatedRequest, 
  SuccessResponse,
  ErrorResponse
} from "../../shared/base-types";

export type TenantData = Tenant;
export type CreateTenantData = InsertTenant;

// Re-export AuthenticatedRequest from base types
export type { AuthenticatedRequest };

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

// Success response types
export interface OnboardingSuccessResponse extends SuccessResponse {
  success: true;
  data: {
    tenant: TenantData;
  };
}

export interface SubscriptionSuccessResponse extends SuccessResponse {
  success: true;
  data: {
    subscriptionId: string;
    clientSecret?: string;
    customerId?: string;
  };
}

export interface SubscriptionData {
  subscriptionId: string;
  clientSecret?: string;
  customerId?: string;
}

// API Response types (can be success or error)
export type OnboardingResponse = OnboardingSuccessResponse | ErrorResponse;
export type SubscriptionResponse = SubscriptionSuccessResponse | ErrorResponse;