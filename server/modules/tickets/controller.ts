import { type Response } from "express";
import { TicketsService } from "./service";
import { AuthService } from "../auth/service";
import { insertTicketSchema, insertTicketCommentSchema } from "@shared/schema";
import type { 
  AuthenticatedRequest,
  TicketsResponse,
  SingleTicketResponse,
  TicketCommentResponse,
  TicketFilters
} from "./types";

export class TicketsController {
  private service: TicketsService;
  private authService: AuthService;

  constructor() {
    this.service = new TicketsService();
    this.authService = new AuthService();
  }

  async getTickets(req: AuthenticatedRequest, res: Response<TicketsResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const filters: TicketFilters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        assigneeId: req.query.assigneeId as string,
      };

      const tickets = await this.service.getTicketsByTenant(user.tenantId, filters);
      res.json({ tickets });
    } catch (error) {
      console.error("Tickets fetch error:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  }

  async createTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertTicketSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
      });

      const ticket = await this.service.createTicket(data);
      res.json(ticket);
    } catch (error) {
      console.error("Ticket creation error:", error);
      res.status(500).json({ message: "Failed to create ticket" });
    }
  }

  async getTicketById(req: AuthenticatedRequest, res: Response<SingleTicketResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const result = await this.service.getTicketDetails(req.params.id, user.tenantId);
      if (!result) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.json(result);
    } catch (error) {
      console.error("Ticket fetch error:", error);
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  }

  async updateTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const ticket = await this.service.updateTicket(req.params.id, req.body);
      res.json(ticket);
    } catch (error) {
      console.error("Ticket update error:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  }

  async createTicketComment(req: AuthenticatedRequest, res: Response<TicketCommentResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertTicketCommentSchema.parse({
        ...req.body,
        ticketId: req.params.id,
        authorId: userId,
      });

      const comment = await this.service.createTicketComment(data);
      res.json({ comment });
    } catch (error) {
      console.error("Comment creation error:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  }
}