import { type Request } from "express";
import type { Ticket, InsertTicket, TicketComment, InsertTicketComment, TimeEntry } from "@shared/schema";

export type TicketData = Ticket;
export type CreateTicketData = InsertTicket;
export type TicketCommentData = TicketComment;
export type CreateTicketCommentData = InsertTicketComment;

// Request types
export interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_image_url: string;
    };
  };
}

// Response types
export interface TicketsResponse {
  tickets: TicketData[];
}

export interface SingleTicketResponse {
  ticket: TicketData;
  comments: TicketCommentData[];
  timeEntries: TimeEntry[];
}

export interface TicketCommentResponse {
  comment: TicketCommentData;
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
}