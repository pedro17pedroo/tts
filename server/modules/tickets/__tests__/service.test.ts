import { TicketsService } from "../service";
import { TicketsRepository } from "../repository";
import { EmailClient } from "../../../clients/email.client";
import { testData } from "../../../shared/test-helpers";

// Mock dependencies
jest.mock("../repository");
jest.mock("../../../clients/email.client");

describe("TicketsService", () => {
  let service: TicketsService;
  let mockRepository: jest.Mocked<TicketsRepository>;
  let mockEmailClient: jest.Mocked<EmailClient>;

  beforeEach(() => {
    service = new TicketsService();
    mockRepository = new TicketsRepository() as jest.Mocked<TicketsRepository>;
    mockEmailClient = new EmailClient() as jest.Mocked<EmailClient>;
    
    // Replace service dependencies with mocks
    service['repository'] = mockRepository;
    service['emailClient'] = mockEmailClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTicketsByTenant", () => {
    it("should return tickets for tenant", async () => {
      const mockTickets = [
        { id: testData.validTicketId, title: "Test Ticket", tenantId: testData.validTenantId }
      ];
      
      mockRepository.getTicketsByTenant.mockResolvedValue(mockTickets as any);

      const result = await service.getTicketsByTenant(testData.validTenantId);

      expect(mockRepository.getTicketsByTenant).toHaveBeenCalledWith(
        testData.validTenantId, 
        undefined
      );
      expect(result).toEqual(mockTickets);
    });

    it("should pass filters to repository", async () => {
      const filters = { status: "open", priority: "high" };
      
      mockRepository.getTicketsByTenant.mockResolvedValue([]);

      await service.getTicketsByTenant(testData.validTenantId, filters);

      expect(mockRepository.getTicketsByTenant).toHaveBeenCalledWith(
        testData.validTenantId, 
        filters
      );
    });
  });

  describe("createTicket", () => {
    it("should create ticket and send notification", async () => {
      const ticketData = {
        title: "New Ticket",
        description: "Test description",
        customerId: testData.validCustomerId,
        tenantId: testData.validTenantId
      };
      
      const mockTicket = { id: testData.validTicketId, ...ticketData };
      const mockCustomer = { id: testData.validCustomerId, email: "customer@test.com" };
      
      mockRepository.createTicket.mockResolvedValue(mockTicket as any);
      mockRepository.getCustomer.mockResolvedValue(mockCustomer as any);
      mockEmailClient.sendTicketNotification.mockResolvedValue(undefined);

      const result = await service.createTicket(ticketData as any);

      expect(mockRepository.createTicket).toHaveBeenCalledWith(ticketData);
      expect(mockRepository.getCustomer).toHaveBeenCalledWith(
        testData.validCustomerId, 
        testData.validTenantId
      );
      expect(mockEmailClient.sendTicketNotification).toHaveBeenCalled();
      expect(result).toEqual(mockTicket);
    });

    it("should create ticket even if email notification fails", async () => {
      const ticketData = {
        title: "New Ticket",
        customerId: testData.validCustomerId,
        tenantId: testData.validTenantId
      };
      
      const mockTicket = { id: testData.validTicketId, ...ticketData };
      const mockCustomer = { id: testData.validCustomerId, email: "customer@test.com" };
      
      mockRepository.createTicket.mockResolvedValue(mockTicket as any);
      mockRepository.getCustomer.mockResolvedValue(mockCustomer as any);
      mockEmailClient.sendTicketNotification.mockRejectedValue(new Error("Email failed"));

      const result = await service.createTicket(ticketData as any);

      expect(result).toEqual(mockTicket);
      // Should not throw error even if email fails
    });
  });

  describe("getTicketDetails", () => {
    it("should return ticket with comments and time entries", async () => {
      const mockTicket = { id: testData.validTicketId, title: "Test Ticket" };
      const mockComments = [{ id: "comment-1", content: "Test comment" }];
      const mockTimeEntries = [{ id: "time-1", hours: 2 }];
      
      mockRepository.getTicket.mockResolvedValue(mockTicket as any);
      mockRepository.getTicketComments.mockResolvedValue(mockComments as any);
      mockRepository.getTimeEntriesByTicket.mockResolvedValue(mockTimeEntries as any);

      const result = await service.getTicketDetails(testData.validTicketId, testData.validTenantId);

      expect(mockRepository.getTicket).toHaveBeenCalledWith(
        testData.validTicketId, 
        testData.validTenantId
      );
      expect(result).toEqual({
        ticket: mockTicket,
        comments: mockComments,
        timeEntries: mockTimeEntries
      });
    });

    it("should return null if ticket not found", async () => {
      mockRepository.getTicket.mockResolvedValue(null);

      const result = await service.getTicketDetails("non-existent", testData.validTenantId);

      expect(result).toBeNull();
    });
  });
});