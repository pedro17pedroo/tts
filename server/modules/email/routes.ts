import { Router } from "express";
import { EmailController } from "./controller";
import { isAuthenticated } from "../../auth";
import type { AuthenticatedRequest } from "../../shared/base-types";
import type { Request, Response } from "express";

const router = Router();
const controller = new EmailController();

// Helper to cast request to AuthenticatedRequest after isAuthenticated middleware
const withAuth = (handler: (req: AuthenticatedRequest, res: Response) => Promise<any>) => {
  return (req: Request, res: Response) => {
    return handler(req as AuthenticatedRequest, res);
  };
};

// Email Configuration (requires authentication)
router.post("/config", isAuthenticated, withAuth(controller.createEmailConfig.bind(controller)));
router.get("/config", isAuthenticated, withAuth(controller.getEmailConfig.bind(controller)));
router.put("/config", isAuthenticated, withAuth(controller.updateEmailConfig.bind(controller)));
router.delete("/config", isAuthenticated, withAuth(controller.deleteEmailConfig.bind(controller)));

// Email Processing (webhook endpoint - no auth required)
router.post("/webhook/inbound", controller.processInboundEmail.bind(controller));

// Email Logs (requires authentication)
router.get("/logs", isAuthenticated, withAuth(controller.getEmailLogs.bind(controller)));
router.get("/logs/status/:status", isAuthenticated, withAuth(controller.getEmailLogsByStatus.bind(controller)));

export { router as emailRoutes };