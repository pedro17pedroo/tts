import { Router } from "express";
import { DashboardController } from "./controller";
import { isAuthenticated } from "../../auth";

const router = Router();
const dashboardController = new DashboardController();

// Dashboard básico
router.get('/stats', isAuthenticated, (req: any, res) =>
  dashboardController.getDashboardStats(req, res)
);

// Relatórios avançados
router.get('/reports/tickets', isAuthenticated, (req: any, res) =>
  dashboardController.getTicketReports(req, res)
);

router.get('/reports/performance', isAuthenticated, (req: any, res) =>
  dashboardController.getPerformanceReports(req, res)
);

router.get('/reports/sla', isAuthenticated, (req: any, res) =>
  dashboardController.getSlaReports(req, res)
);

router.get('/reports/hour-bank', isAuthenticated, (req: any, res) =>
  dashboardController.getHourBankReports(req, res)
);

router.get('/reports/trends', isAuthenticated, (req: any, res) =>
  dashboardController.getTrendReports(req, res)
);

// Exportação de relatórios
router.get('/export/csv', isAuthenticated, (req: any, res) =>
  dashboardController.exportReportsCsv(req, res)
);

export { router as dashboardModule };