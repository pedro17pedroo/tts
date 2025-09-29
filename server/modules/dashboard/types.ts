import type { AuthenticatedRequest } from "../../shared/base-types";

// Export the global AuthenticatedRequest for consistency
export type { AuthenticatedRequest };

// Response types
export interface DashboardStatsResponse {
  stats?: any;
  message?: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
  category?: string;
  customerId?: string;
  period?: string;
  metric?: string;
}

export interface TicketReport {
  totalTickets: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  avgResolutionTime: number;
  trends: Array<{
    date: string;
    count: number;
  }>;
}

export interface PerformanceReport {
  avgResponseTime: number;
  avgResolutionTime: number;
  ticketsPerAgent: Array<{
    agentId: string;
    agentName: string;
    ticketCount: number;
    avgResolutionTime: number;
  }>;
  customerSatisfaction: number;
  productivity: {
    hoursWorked: number;
    ticketsResolved: number;
    efficiency: number;
  };
}

export interface SlaReport {
  totalSlas: number;
  metSlas: number;
  breachedSlas: number;
  atRiskSlas: number;
  complianceRate: number;
  byPriority: Record<string, {
    total: number;
    met: number;
    breached: number;
    rate: number;
  }>;
}

export interface HourBankReport {
  totalSold: number;
  totalConsumed: number;
  totalAvailable: number;
  utilizationRate: number;
  byCustomer: Array<{
    customerId: string;
    customerName: string;
    sold: number;
    consumed: number;
    available: number;
    utilizationRate: number;
  }>;
}

export interface TrendReport {
  metric: string;
  period: string;
  data: Array<{
    date: string;
    value: number;
    change?: number;
  }>;
  summary: {
    total: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
  };
}