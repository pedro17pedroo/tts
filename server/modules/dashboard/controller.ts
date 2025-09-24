import { type Response } from "express";
import { DashboardService } from "./service";
import { AuthService } from "../auth/service";
import type { 
  AuthenticatedRequest,
  DashboardStatsResponse
} from "./types";

export class DashboardController {
  private service: DashboardService;
  private authService: AuthService;

  constructor() {
    this.service = new DashboardService();
    this.authService = new AuthService();
  }

  async getDashboardStats(req: AuthenticatedRequest, res: Response<DashboardStatsResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const stats = await this.service.getDashboardStats(user.tenantId);
      res.json({ stats });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  }
}