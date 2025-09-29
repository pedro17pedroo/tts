import { BaseRepository } from "../../repositories/base.repository";
import type { Ticket, InsertTicket, TicketComment, InsertTicketComment, TimeEntry, Customer } from "../../schema";

export class TicketsRepository extends BaseRepository {
  async getTicketsByTenant(tenantId: string, filters?: any): Promise<Ticket[]> {
    return this.storage.getTicketsByTenant(tenantId, filters);
  }

  async getTicket(id: string, tenantId: string): Promise<Ticket | undefined> {
    return this.storage.getTicket(id, tenantId);
  }

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    return this.storage.createTicket(ticketData);
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    return this.storage.updateTicket(id, updates);
  }

  async getTicketComments(ticketId: string): Promise<TicketComment[]> {
    return this.storage.getTicketComments(ticketId);
  }

  async createTicketComment(commentData: InsertTicketComment): Promise<TicketComment> {
    return this.storage.createTicketComment(commentData);
  }

  async getTimeEntriesByTicket(ticketId: string): Promise<TimeEntry[]> {
    return this.storage.getTimeEntriesByTicket(ticketId);
  }

  async getCustomer(id: string, tenantId: string): Promise<Customer | undefined> {
    return this.storage.getCustomer(id, tenantId);
  }
}