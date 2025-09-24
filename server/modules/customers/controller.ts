import { type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { CustomersService } from "./service";
import { insertCustomerSchema } from "@shared/schema";
import type { 
  AuthenticatedRequest,
  CustomerResponse,
  SingleCustomerResponse
} from "./types";

export class CustomersController extends BaseController {
  private service: CustomersService;

  constructor() {
    super();
    this.service = new CustomersService();
  }

  async getCustomers(req: AuthenticatedRequest, res: Response<CustomerResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const customers = await this.service.getCustomersByTenant(tenantId);
      this.sendSuccess(res, customers);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch customers");
    }
  }

  async createCustomer(req: AuthenticatedRequest, res: Response<SingleCustomerResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const data = insertCustomerSchema.parse({
        ...req.body,
        tenantId,
      });

      const customer = await this.service.createCustomer(data);
      this.sendSuccessWithStatus(res, 201, customer, "Customer created successfully");
    } catch (error) {
      this.handleError(error, res, "Failed to create customer");
    }
  }
}