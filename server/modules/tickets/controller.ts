import { type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { TicketsService } from "./service";
import { z } from "zod";
import type { 
  AuthenticatedRequest,
  TicketsResponse,
  SingleTicketResponse,
  TicketCommentResponse,
  TicketFilters
} from "./types";

// Simple validation schemas
const createTicketSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  customerId: z.string(),
  departmentId: z.string().optional(),
  categoryId: z.string().optional(),
  assigneeId: z.string().optional(),
});

const createTicketCommentSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
  isInternal: z.boolean().default(false),
});

export class TicketsController extends BaseController {
  private service: TicketsService;

  constructor() {
    super();
    this.service = new TicketsService();
  }

  async getTickets(req: AuthenticatedRequest, res: Response<TicketsResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const filters: TicketFilters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        assigneeId: req.query.assigneeId as string,
      };

      const tickets = await this.service.getTicketsByTenant(tenantId, filters);
      this.sendSuccess(res, tickets);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch tickets");
    }
  }

  async createTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const validatedData = createTicketSchema.parse(req.body);
      const ticketData = {
        ...validatedData,
        tenantId,
      };

      const ticket = await this.service.createTicket(ticketData);
      this.sendSuccessWithStatus(res, 201, ticket, "Ticket created successfully");
    } catch (error) {
      this.handleError(error, res, "Failed to create ticket");
    }
  }

  async getTicketById(req: AuthenticatedRequest, res: Response<SingleTicketResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const result = await this.service.getTicketDetails(req.params.id, tenantId);
      if (!result) {
        return this.handleNotFound(res, "Ticket not found");
      }

      this.sendSuccess(res, result);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch ticket");
    }
  }

  async updateTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const ticket = await this.service.updateTicket(req.params.id, req.body);
      this.sendSuccess(res, ticket, "Ticket updated successfully");
    } catch (error) {
      this.handleError(error, res, "Failed to update ticket");
    }
  }

  async createTicketComment(req: AuthenticatedRequest, res: Response<TicketCommentResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { user } = authResult;
      const validatedData = createTicketCommentSchema.parse(req.body);
      const commentData = {
        ...validatedData,
        ticketId: req.params.id,
        authorId: user.id,
      };

      const comment = await this.service.createTicketComment(commentData);
      this.sendSuccessWithStatus(res, 201, comment, "Comment created successfully");
    } catch (error) {
      this.handleError(error, res, "Failed to create comment");
    }
  }
}