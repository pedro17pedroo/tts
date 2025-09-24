import type { 
  SlaConfig, 
  InsertSlaConfig, 
  SlaStatus, 
  InsertSlaStatus, 
  SlaLogs, 
  InsertSlaLog,
  Ticket 
} from "@shared/schema";
import type { 
  AuthenticatedRequest, 
  ApiResponse, 
  BaseFilters,
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse
} from "../../shared/base-types";

// Data types
export type SlaConfigData = SlaConfig;
export type CreateSlaConfigData = InsertSlaConfig;
export type UpdateSlaConfigData = Partial<InsertSlaConfig>;

export type SlaStatusData = SlaStatus;
export type CreateSlaStatusData = InsertSlaStatus;
export type UpdateSlaStatusData = Partial<InsertSlaStatus>;

export type SlaLogData = SlaLogs;
export type CreateSlaLogData = InsertSlaLog;

// Re-export AuthenticatedRequest from base types
export type { AuthenticatedRequest };

// Filters
export interface SlaConfigFilters extends BaseFilters {
  tenantId?: string;
  categoryId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isActive?: boolean;
}

export interface SlaStatusFilters extends BaseFilters {
  tenantId?: string;
  status?: 'compliant' | 'at_risk' | 'breached';
  dueToday?: boolean;
  overdue?: boolean;
}

export interface SlaLogFilters extends BaseFilters {
  tenantId?: string;
  ticketId?: string;
  action?: 'created' | 'updated' | 'deleted' | 'violation' | 'resolution';
  eventType?: string;
  dateFrom?: string;
  dateTo?: string;
}

// SLA calculation types
export interface SlaCalculationResult {
  ticketId: string;
  slaConfigId: string;
  firstResponseDueAt: Date;
  resolutionDueAt: Date;
  firstResponseStatus: 'compliant' | 'at_risk' | 'breached';
  resolutionStatus: 'compliant' | 'at_risk' | 'breached';
  firstResponseTimeRemaining: number;
  resolutionTimeRemaining: number;
  isBusinessHours: boolean;
}

// Business hours calculation
export interface BusinessHoursConfig {
  start: string; // "09:00"
  end: string;   // "18:00"
  days: number[]; // [1,2,3,4,5] (Monday to Friday)
  timezone: string;
}

// SLA Alert types
export interface SlaAlert {
  id: string;
  ticketId: string;
  type: 'first_response_warning' | 'resolution_warning' | 'first_response_breach' | 'resolution_breach';
  priority: 'low' | 'medium' | 'high' | 'critical';
  percentage: number; // 70, 85, 100 (breach)
  timeRemaining: number; // minutes
  dueAt: Date;
  message: string;
  createdAt: Date;
}

// Reports types
export interface SlaReportData {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalTickets: number;
    compliantTickets: number;
    atRiskTickets: number;
    breachedTickets: number;
    complianceRate: number;
  };
  byPriority: {
    priority: string;
    total: number;
    compliant: number;
    breached: number;
    rate: number;
  }[];
  byCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
    compliant: number;
    breached: number;
    rate: number;
  }[];
  trends: {
    date: string;
    compliant: number;
    breached: number;
  }[];
}

// Service method parameters
export interface CreateSlaConfigParams {
  tenantId: string;
  categoryId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  firstResponseMinutes: number;
  resolutionMinutes: number;
  businessHoursStart?: string;
  businessHoursEnd?: string;
  businessDays?: number[];
  timezone?: string;
}

export interface CalculateSlaParams {
  ticketId: string;
  tenantId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  categoryId?: string;
  createdAt: Date;
  currentTime?: Date;
}

export interface UpdateSlaStatusParams {
  ticketId: string;
  firstResponseAt?: Date;
  resolvedAt?: Date;
  currentTime?: Date;
}

// Success response types
export interface SlaConfigsSuccessResponse extends SuccessResponse<SlaConfigData[]> {
  success: true;
  data: SlaConfigData[];
}

export interface SlaConfigSuccessResponse extends SuccessResponse<SlaConfigData> {
  success: true;
  data: SlaConfigData;
}

export interface SlaStatusSuccessResponse extends SuccessResponse<SlaStatusData> {
  success: true;
  data: SlaStatusData;
}

export interface SlaStatusWithTicketSuccessResponse extends SuccessResponse {
  success: true;
  data: {
    slaStatus: SlaStatusData;
    ticket: Ticket;
    slaConfig?: SlaConfigData;
  };
}

export interface SlaAlertsSuccessResponse extends SuccessResponse<SlaAlert[]> {
  success: true;
  data: SlaAlert[];
}

export interface SlaReportSuccessResponse extends SuccessResponse<SlaReportData> {
  success: true;
  data: SlaReportData;
}

export interface SlaLogSuccessResponse extends SuccessResponse<SlaLogData> {
  success: true;
  data: SlaLogData;
}

export interface SlaLogsSuccessResponse extends SuccessResponse<SlaLogData[]> {
  success: true;
  data: SlaLogData[];
}

// API Response types (can be success or error)
export type SlaConfigsResponse = SlaConfigsSuccessResponse | ErrorResponse;
export type SlaConfigResponse = SlaConfigSuccessResponse | ErrorResponse;
export type SlaStatusResponse = SlaStatusSuccessResponse | ErrorResponse;
export type SlaStatusWithTicketResponse = SlaStatusWithTicketSuccessResponse | ErrorResponse;
export type SlaAlertsResponse = SlaAlertsSuccessResponse | ErrorResponse;
export type SlaReportResponse = SlaReportSuccessResponse | ErrorResponse;
export type SlaLogResponse = SlaLogSuccessResponse | ErrorResponse;
export type SlaLogsResponse = SlaLogsSuccessResponse | ErrorResponse;

// Common response for operations without data
export type SlaOperationResponse = SuccessResponse<{ message: string }> | ErrorResponse;