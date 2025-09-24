import { AuthController } from "../controller";
import { AuthService } from "../service";
import { createMockResponse, createMockAuthenticatedRequest, testData } from "../../../shared/test-helpers";
import type { AuthenticatedRequest } from "../types";
import { Response } from "express";

// Mock the service
jest.mock("../service");

describe("AuthController", () => {
  let controller: AuthController;
  let mockService: jest.Mocked<AuthService>;
  let mockRes: Partial<Response>;
  let mockReq: Partial<AuthenticatedRequest>;

  beforeEach(() => {
    controller = new AuthController();
    mockService = new AuthService() as jest.Mocked<AuthService>;
    mockRes = createMockResponse();
    mockReq = createMockAuthenticatedRequest();
    
    // Replace service with mock
    controller['service'] = mockService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrentUser", () => {
    it("should return current user data", async () => {
      const mockUser = {
        id: testData.validUserId,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        tenantId: testData.validTenantId
      };
      
      mockService.getCurrentUser.mockResolvedValue(mockUser as any);
      jest.spyOn(controller as any, 'sendSuccess');

      await controller.getCurrentUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockService.getCurrentUser).toHaveBeenCalledWith(mockReq.user?.claims);
      expect(controller['sendSuccess']).toHaveBeenCalledWith(mockRes, mockUser);
    });

    it("should handle service errors", async () => {
      const error = new Error("User not found");
      mockService.getCurrentUser.mockRejectedValue(error);
      jest.spyOn(controller as any, 'handleError');

      await controller.getCurrentUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(controller['handleError']).toHaveBeenCalledWith(
        error, 
        mockRes, 
        "Failed to fetch user"
      );
    });

    it("should handle missing user claims", async () => {
      mockReq.user = undefined;
      jest.spyOn(controller as any, 'handleError');

      await controller.getCurrentUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(controller['handleError']).toHaveBeenCalled();
    });
  });
});