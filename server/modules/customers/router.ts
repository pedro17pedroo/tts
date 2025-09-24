import { Router } from "express";
import { CustomersController } from "./controller";
import { isAuthenticated } from "../../replitAuth";

const router = Router();
const customersController = new CustomersController();

// Get customers
router.get('/', isAuthenticated, (req: any, res) =>
  customersController.getCustomers(req, res)
);

// Create customer
router.post('/', isAuthenticated, (req: any, res) =>
  customersController.createCustomer(req, res)
);

export { router as customersModule };