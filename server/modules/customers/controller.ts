import { type Response } from "express";
import { CustomersService } from "./service";
import { AuthService } from "../auth/service";
import { insertCustomerSchema } from "@shared/schema";
import type { 
  AuthenticatedRequest,
  CustomerResponse,
  SingleCustomerResponse
} from "./types";

export class CustomersController {
  private service: CustomersService;
  private authService: AuthService;

  constructor() {
    this.service = new CustomersService();
    this.authService = new AuthService();
  }

  async getCustomers(req: AuthenticatedRequest, res: Response<CustomerResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const customers = await this.service.getCustomersByTenant(user.tenantId);
      res.json({ customers });
    } catch (error) {
      console.error("Customers fetch error:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  }

  async createCustomer(req: AuthenticatedRequest, res: Response<SingleCustomerResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertCustomerSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
      });

      const customer = await this.service.createCustomer(data);
      res.json({ customer });
    } catch (error) {
      console.error("Customer creation error:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  }
}