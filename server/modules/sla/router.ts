import { Router } from "express";
import { SlaController } from "./controller";
import { isAuthenticated } from "../../auth";

const router = Router();
const slaController = new SlaController();

// SLA Configuration Management
router.get('/configs', isAuthenticated, (req: any, res) =>
  slaController.getSlaConfigs(req, res)
);

router.get('/configs/:id', isAuthenticated, (req: any, res) =>
  slaController.getSlaConfig(req, res)
);

router.post('/configs', isAuthenticated, (req: any, res) =>
  slaController.createSlaConfig(req, res)
);

router.patch('/configs/:id', isAuthenticated, (req: any, res) =>
  slaController.updateSlaConfig(req, res)
);

router.delete('/configs/:id', isAuthenticated, (req: any, res) =>
  slaController.deleteSlaConfig(req, res)
);

// SLA Status Management
router.get('/status/:ticketId', isAuthenticated, (req: any, res) =>
  slaController.getSlaStatusByTicket(req, res)
);

router.get('/status', isAuthenticated, (req: any, res) =>
  slaController.getSlaStatuses(req, res)
);

// SLA Calculation and Recalculation
router.post('/calculate', isAuthenticated, (req: any, res) =>
  slaController.calculateSlaForTicket(req, res)
);

router.post('/recalculate-all', isAuthenticated, (req: any, res) =>
  slaController.recalculateAllSlas(req, res)
);

// SLA Alerts
router.get('/alerts', isAuthenticated, (req: any, res) =>
  slaController.getSlaAlerts(req, res)
);

// SLA Reports
router.get('/reports', isAuthenticated, (req: any, res) =>
  slaController.getSlaReport(req, res)
);

// SLA Logs and Audit Trail
router.get('/logs', isAuthenticated, (req: any, res) =>
  slaController.getSlaLogs(req, res)
);

// SLA Status Updates (for webhook/integration use)
router.patch('/status', isAuthenticated, (req: any, res) =>
  slaController.updateSlaStatus(req, res)
);

export { router as slaModule };