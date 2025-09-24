import { CustomersController } from "../controller";
import { CustomersService } from "../service";
import { createMockResponse, createMockAuthenticatedRequest, testData } from "../../../shared/test-helpers";
import type { AuthenticatedRequest } from "../types";
import { Response } from "express";

// Mock the service
jest.mock("../service");
jest.mock("../../auth/service");

describe("CustomersController", () => {
  let controller: CustomersController;
  let mockService: jest.Mocked<CustomersService>;
  let mockRes: Partial<Response>;
  let mockReq: Partial<AuthenticatedRequest>;

  beforeEach(() => {
    controller = new CustomersController();
    mockService = new CustomersService() as jest.Mocked<CustomersService>;
    mockRes = createMockResponse();
    mockReq = createMockAuthenticatedRequest();
    
    // Mock the getAuthenticatedUser method
    jest.spyOn(controller as any, 'getAuthenticatedUser').mockResolvedValue({
      user: { id: testData.validUserId, tenantId: testData.validTenantId },
      tenantId: testData.validTenantId
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCustomers", () => {
    it("should return customers for authenticated user", async () => {
      const mockCustomers = [
        { id: testData.validCustomerId, name: "Test Customer", email: "customer@test.com" }
      ];
      
      mockService.getCustomersByTenant = jest.fn().mockResolvedValue(mockCustomers);
      jest.spyOn(controller as any, 'sendSuccess');

      await controller.getCustomers(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockService.getCustomersByTenant).toHaveBeenCalledWith(testData.validTenantId);
      expect(controller['sendSuccess']).toHaveBeenCalledWith(mockRes, mockCustomers);
    });

    it("should handle unauthorized user", async () => {
      jest.spyOn(controller as any, 'getAuthenticatedUser').mockResolvedValue(null);
      jest.spyOn(controller as any, 'handleUnauthorized');

      await controller.getCustomers(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(controller['handleUnauthorized']).toHaveBeenCalledWith(
        mockRes, 
        "User not associated with tenant"
      );
    });
  });

  describe("createCustomer", () => {
    it("should create a new customer", async () => {
      const customerData = { name: "New Customer", email: "new@customer.com" };
      const mockCustomer = { id: testData.validCustomerId, ...customerData };
      
      mockReq.body = customerData;
      mockService.createCustomer = jest.fn().mockResolvedValue(mockCustomer);
      jest.spyOn(controller as any, 'sendSuccessWithStatus');

      await controller.createCustomer(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockService.createCustomer).toHaveBeenCalled();
      expect(controller['sendSuccessWithStatus']).toHaveBeenCalledWith(
        mockRes, 
        201, 
        mockCustomer, 
        "Customer created successfully"
      );
    });

    it("should handle validation errors", async () => {
      const error = new Error("Validation failed");
      mockService.createCustomer = jest.fn().mockRejectedValue(error);
      jest.spyOn(controller as any, 'handleError');

      await controller.createCustomer(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(controller['handleError']).toHaveBeenCalledWith(
        error, 
        mockRes, 
        "Failed to create customer"
      );
    });
  });
});