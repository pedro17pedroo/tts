import { type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { CustomersService } from "./service";
import { z } from "zod";
import type { 
  AuthenticatedRequest,
  CustomerResponse,
  SingleCustomerResponse
} from "./types";

// Simple customer validation schema
const createCustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  company: z.string().optional(),
  tenantId: z.string(),
});

export class CustomersController extends BaseController {
  private service: CustomersService;

  constructor() {
    super();
    this.service = new CustomersService();
  }

  async getCustomers(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const customers = await this.service.getCustomersByTenant(tenantId);
      return this.sendSuccess(res, customers);
    } catch (error) {
      return this.handleError(error, res, "Failed to fetch customers");
    }
  }

  async createCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const data = createCustomerSchema.parse({
        ...req.body,
        tenantId,
      });

      const customer = await this.service.createCustomer(data);
      return this.sendSuccessWithStatus(res, 201, customer, "Customer created successfully");
    } catch (error) {
      return this.handleError(error, res, "Failed to create customer");
    }
  }
}