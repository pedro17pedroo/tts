import { TicketsController } from "../controller";
import { TicketsService } from "../service";
import { createMockResponse, createMockAuthenticatedRequest, testData } from "../../../shared/test-helpers";
import type { AuthenticatedRequest } from "../types";
import { Response } from "express";

// Mock the service
jest.mock("../service");
jest.mock("../../auth/service");

describe("TicketsController", () => {
  let controller: TicketsController;
  let mockService: jest.Mocked<TicketsService>;
  let mockRes: Partial<Response>;
  let mockReq: Partial<AuthenticatedRequest>;

  beforeEach(() => {
    controller = new TicketsController();
    mockService = new TicketsService() as jest.Mocked<TicketsService>;
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

  describe("getTickets", () => {
    it("should return tickets for authenticated user", async () => {
      const mockTickets = [
        { id: testData.validTicketId, title: "Test Ticket", status: "new" }
      ];
      
      mockService.getTicketsByTenant = jest.fn().mockResolvedValue(mockTickets);
      jest.spyOn(controller as any, 'sendSuccess');

      await controller.getTickets(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockService.getTicketsByTenant).toHaveBeenCalledWith(
        testData.validTenantId,
        expect.any(Object)
      );
      expect(controller['sendSuccess']).toHaveBeenCalledWith(mockRes, mockTickets);
    });

    it("should handle unauthorized user", async () => {
      jest.spyOn(controller as any, 'getAuthenticatedUser').mockResolvedValue(null);
      jest.spyOn(controller as any, 'handleUnauthorized');

      await controller.getTickets(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(controller['handleUnauthorized']).toHaveBeenCalledWith(
        mockRes, 
        "User not associated with tenant"
      );
    });

    it("should handle service errors", async () => {
      const error = new Error("Service error");
      mockService.getTicketsByTenant = jest.fn().mockRejectedValue(error);
      jest.spyOn(controller as any, 'handleError');

      await controller.getTickets(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(controller['handleError']).toHaveBeenCalledWith(
        error, 
        mockRes, 
        "Failed to fetch tickets"
      );
    });
  });

  describe("createTicket", () => {
    it("should create a new ticket", async () => {
      const ticketData = { title: "New Ticket", description: "Test description" };
      const mockTicket = { id: testData.validTicketId, ...ticketData };
      
      mockReq.body = ticketData;
      mockService.createTicket = jest.fn().mockResolvedValue(mockTicket);
      jest.spyOn(controller as any, 'sendSuccessWithStatus');

      await controller.createTicket(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockService.createTicket).toHaveBeenCalled();
      expect(controller['sendSuccessWithStatus']).toHaveBeenCalledWith(
        mockRes, 
        201, 
        mockTicket, 
        "Ticket created successfully"
      );
    });
  });

  describe("getTicketById", () => {
    it("should return ticket details", async () => {
      const mockTicketDetails = {
        ticket: { id: testData.validTicketId, title: "Test Ticket" },
        comments: [],
        timeEntries: []
      };
      
      mockReq.params = { id: testData.validTicketId };
      mockService.getTicketDetails = jest.fn().mockResolvedValue(mockTicketDetails);
      jest.spyOn(controller as any, 'sendSuccess');

      await controller.getTicketById(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockService.getTicketDetails).toHaveBeenCalledWith(
        testData.validTicketId, 
        testData.validTenantId
      );
      expect(controller['sendSuccess']).toHaveBeenCalledWith(mockRes, mockTicketDetails);
    });

    it("should handle ticket not found", async () => {
      mockReq.params = { id: "non-existent" };
      mockService.getTicketDetails = jest.fn().mockResolvedValue(null);
      jest.spyOn(controller as any, 'handleNotFound');

      await controller.getTicketById(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(controller['handleNotFound']).toHaveBeenCalledWith(
        mockRes, 
        "Ticket not found"
      );
    });
  });
});