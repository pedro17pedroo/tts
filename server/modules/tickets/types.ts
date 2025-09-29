import type { Ticket, InsertTicket, TicketComment, InsertTicketComment, TimeEntry } from "../../schema";
import type { 
  AuthenticatedRequest, 
  ApiResponse, 
  BaseFilters,
  SuccessResponse,
  ErrorResponse
} from "../../shared/base-types";

export type TicketData = Ticket;
export type CreateTicketData = InsertTicket;
export type TicketCommentData = TicketComment;
export type CreateTicketCommentData = InsertTicketComment;

// Re-export AuthenticatedRequest from base types
export type { AuthenticatedRequest };

// Success response types
export interface TicketsSuccessResponse extends SuccessResponse<TicketData[]> {
  success: true;
  data: TicketData[];
}

export interface SingleTicketSuccessResponse extends SuccessResponse {
  success: true;
  data: {
    ticket: TicketData;
    comments: TicketCommentData[];
    timeEntries: TimeEntry[];
  };
}

export interface TicketCommentSuccessResponse extends SuccessResponse<TicketCommentData> {
  success: true;
  data: TicketCommentData;
}

// API Response types (can be success or error)
export type TicketsResponse = TicketsSuccessResponse | ErrorResponse;
export type SingleTicketResponse = SingleTicketSuccessResponse | ErrorResponse;
export type TicketCommentResponse = TicketCommentSuccessResponse | ErrorResponse;

export interface TicketFilters extends BaseFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
}