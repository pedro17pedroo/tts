import { DashboardRepository } from "./repository";
import type { 
  ReportFilters, 
  TicketReport, 
  PerformanceReport, 
  SlaReport, 
  HourBankReport, 
  TrendReport 
} from "./types";

export class DashboardService {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  async getDashboardStats(tenantId: string): Promise<any> {
    return this.repository.getDashboardStats(tenantId);
  }

  async getTicketReports(tenantId: string, filters: ReportFilters): Promise<TicketReport> {
    return this.repository.getTicketReports(tenantId, filters);
  }

  async getPerformanceReports(tenantId: string, period?: string): Promise<PerformanceReport> {
    return this.repository.getPerformanceReports(tenantId, period);
  }

  async getSlaReports(tenantId: string, filters: ReportFilters): Promise<SlaReport> {
    return this.repository.getSlaReports(tenantId, filters);
  }

  async getHourBankReports(tenantId: string, customerId?: string): Promise<HourBankReport> {
    return this.repository.getHourBankReports(tenantId, customerId);
  }

  async getTrendReports(tenantId: string, options: { period?: string; metric?: string }): Promise<TrendReport> {
    return this.repository.getTrendReports(tenantId, options);
  }

  async exportReportsCsv(tenantId: string, reportType: string, filters: any): Promise<string> {
    return this.repository.exportReportsCsv(tenantId, reportType, filters);
  }
}