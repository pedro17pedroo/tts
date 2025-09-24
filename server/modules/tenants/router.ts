import { Router } from "express";
import { TenantsController } from "./controller";
import { isAuthenticated } from "../../replitAuth";

const router = Router();
const tenantsController = new TenantsController();

// Tenant onboarding
router.post('/onboarding', isAuthenticated, (req: any, res) =>
  tenantsController.completeOnboarding(req, res)
);

// Onboarding subscription (before tenant exists)
router.post('/onboarding-subscription', isAuthenticated, (req: any, res) =>
  tenantsController.createOnboardingSubscription(req, res)
);

// Subscription management
router.post('/create-subscription', isAuthenticated, (req: any, res) =>
  tenantsController.createSubscription(req, res)
);

export { router as tenantsModule };