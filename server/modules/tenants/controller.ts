import { type Response } from "express";
import { TenantsService } from "./service";
import { AuthService } from "../auth/service";
import { 
  onboardingSchema,
  type AuthenticatedRequest,
  type OnboardingResponse, 
  type SubscriptionResponse,
  type OnboardingData 
} from "./types";

export class TenantsController {
  private service: TenantsService;
  private authService: AuthService;

  constructor() {
    this.service = new TenantsService();
    this.authService = new AuthService();
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

      res.json({ tenant, success: true });
    } catch (error: any) {
      console.error("Onboarding error:", error);
      res.status(500).json({ message: error.message || "Failed to complete onboarding" });
    }
  }

  async createOnboardingSubscription(req: AuthenticatedRequest, res: Response<SubscriptionResponse>) {
    try {
      const userClaims = req.user.claims;
      const { planType, tenantName } = req.body;

      const result = await this.service.createOnboardingSubscription(planType, userClaims, tenantName);
      res.json(result);
    } catch (error: any) {
      console.error("Onboarding subscription error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async createSubscription(req: AuthenticatedRequest, res: Response<SubscriptionResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const result = await this.service.createSubscription(user);
      res.json(result);
    } catch (error: any) {
      console.error("Subscription error:", error);
      res.status(500).json({ message: error.message });
    }
  }
}