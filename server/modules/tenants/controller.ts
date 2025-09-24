import { type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { TenantsService } from "./service";
import { 
  onboardingSchema,
  type AuthenticatedRequest,
  type OnboardingResponse, 
  type SubscriptionResponse,
  type OnboardingData 
} from "./types";

export class TenantsController extends BaseController {
  private service: TenantsService;

  constructor() {
    super();
    this.service = new TenantsService();
  }

  async completeOnboarding(req: AuthenticatedRequest, res: Response<OnboardingResponse>) {
    try {
      const userId = req.user.claims.sub;
      const userClaims = req.user.claims;
      const data = onboardingSchema.parse(req.body);

      const tenant = await this.service.completeTenantOnboarding(data, {
        id: userId,
        email: userClaims.email,
        firstName: userClaims.first_name,
        lastName: userClaims.last_name,
        profileImageUrl: userClaims.profile_image_url,
      } as any);

      // Update user to be tenant admin
      await this.authService.upsertUser({
        id: userId,
        email: userClaims.email,
        firstName: userClaims.first_name,
        lastName: userClaims.last_name,
        profileImageUrl: userClaims.profile_image_url,
        role: 'tenant_admin',
        tenantId: tenant.id,
      });

      this.sendSuccess(res, { tenant }, "Onboarding completed successfully");
    } catch (error: any) {
      this.handleError(error, res, "Failed to complete onboarding");
    }
  }

  async createOnboardingSubscription(req: AuthenticatedRequest, res: Response<SubscriptionResponse>) {
    try {
      const userClaims = req.user.claims;
      const { planType, tenantName } = req.body;

      const result = await this.service.createOnboardingSubscription(planType, userClaims, tenantName);
      this.sendSuccess(res, result, "Subscription created successfully");
    } catch (error: any) {
      this.handleError(error, res, "Failed to create subscription");
    }
  }

  async createSubscription(req: AuthenticatedRequest, res: Response<SubscriptionResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not found");
      }

      const { user } = authResult;
      const result = await this.service.createSubscription(user);
      this.sendSuccess(res, result, "Subscription created successfully");
    } catch (error: any) {
      this.handleError(error, res, "Failed to create subscription");
    }
  }
}