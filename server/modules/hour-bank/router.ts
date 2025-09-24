import { Router } from "express";
import { HourBankController } from "./controller";
import { isAuthenticated } from "../../replitAuth";

const router = Router();
const hourBankController = new HourBankController();

// Hour banks routes
router.get('/', isAuthenticated, (req: any, res) =>
  hourBankController.getHourBanks(req, res)
);

router.post('/', isAuthenticated, (req: any, res) =>
  hourBankController.createHourBank(req, res)
);

// Time entries routes
router.post('/time-entries', isAuthenticated, (req: any, res) =>
  hourBankController.createTimeEntry(req, res)
);

router.patch('/time-entries/:id', isAuthenticated, (req: any, res) =>
  hourBankController.updateTimeEntry(req, res)
);

export { router as hourBankModule };