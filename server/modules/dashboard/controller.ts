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

  async getDashboardStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const stats = await this.service.getDashboardStats(user.tenantId);
      return res.json({ stats });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  }

  async getTicketReports(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const { startDate, endDate, status, priority, category } = req.query;
      const reports = await this.service.getTicketReports(user.tenantId, {
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as string,
        priority: priority as string,
        category: category as string
      });
      
      return res.json({ reports });
    } catch (error) {
      console.error("Ticket reports error:", error);
      return res.status(500).json({ message: "Failed to fetch ticket reports" });
    }
  }

  async getPerformanceReports(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const { period } = req.query;
      const reports = await this.service.getPerformanceReports(user.tenantId, period as string);
      return res.json({ reports });
    } catch (error) {
      console.error("Performance reports error:", error);
      return res.status(500).json({ message: "Failed to fetch performance reports" });
    }
  }

  async getSlaReports(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const { startDate, endDate } = req.query;
      const reports = await this.service.getSlaReports(user.tenantId, {
        startDate: startDate as string,
        endDate: endDate as string
      });
      
      return res.json({ reports });
    } catch (error) {
      console.error("SLA reports error:", error);
      return res.status(500).json({ message: "Failed to fetch SLA reports" });
    }
  }

  async getHourBankReports(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const { customerId } = req.query;
      const reports = await this.service.getHourBankReports(user.tenantId, customerId as string);
      return res.json({ reports });
    } catch (error) {
      console.error("Hour bank reports error:", error);
      return res.status(500).json({ message: "Failed to fetch hour bank reports" });
    }
  }

  async getTrendReports(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const { period, metric } = req.query;
      const reports = await this.service.getTrendReports(user.tenantId, {
        period: period as string,
        metric: metric as string
      });
      
      return res.json({ reports });
    } catch (error) {
      console.error("Trend reports error:", error);
      return res.status(500).json({ message: "Failed to fetch trend reports" });
    }
  }

  async exportReportsCsv(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const { reportType, ...filters } = req.query;
      const csvData = await this.service.exportReportsCsv(user.tenantId, reportType as string, filters);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csvData);
    } catch (error) {
      console.error("Export CSV error:", error);
      return res.status(500).json({ message: "Failed to export reports" });
    }
  }
}