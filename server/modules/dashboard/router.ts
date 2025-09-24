import { Router } from "express";
import { DashboardController } from "./controller";
import { isAuthenticated } from "../../auth";

const router = Router();
const dashboardController = new DashboardController();

// Get dashboard stats
router.get('/stats', isAuthenticated, (req: any, res) =>
  dashboardController.getDashboardStats(req, res)
);

export { router as dashboardModule };