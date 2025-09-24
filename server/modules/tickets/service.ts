import { TicketsRepository } from "./repository";
import { EmailClient } from "../../clients/email.client";
import type { Ticket, InsertTicket, TicketComment, InsertTicketComment } from "@shared/schema";
import type { TicketFilters } from "./types";

export class TicketsService {
  private repository: TicketsRepository;
  private emailClient: EmailClient;

  constructor() {
    this.repository = new TicketsRepository();
    this.emailClient = new EmailClient();
  }

  async getTicketsByTenant(tenantId: string, filters?: TicketFilters): Promise<Ticket[]> {
    return this.repository.getTicketsByTenant(tenantId, filters);
  }

  async getTicketDetails(id: string, tenantId: string) {
    const ticket = await this.repository.getTicket(id, tenantId);
    if (!ticket) {
      return null;
    }

    const comments = await this.repository.getTicketComments(ticket.id);
    const timeEntries = await this.repository.getTimeEntriesByTicket(ticket.id);

    return { ticket, comments, timeEntries };
  }

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    const ticket = await this.repository.createTicket(ticketData);

    // Send notification email
    try {
      const customer = await this.repository.getCustomer(ticket.customerId, ticketData.tenantId);
      if (customer?.email) {
        await this.emailClient.sendTicketNotification({
          customerEmail: customer.email,
          ticketId: ticket.id,
          ticketTitle: ticket.title,
          status: ticket.status,
          priority: ticket.priority,
        });
      }
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail the ticket creation if email fails
    }

    return ticket;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    return this.repository.updateTicket(id, updates);
  }

  async createTicketComment(commentData: InsertTicketComment): Promise<TicketComment> {
    return this.repository.createTicketComment(commentData);
  }
}