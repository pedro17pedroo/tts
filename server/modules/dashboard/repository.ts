import { BaseRepository } from "../../repositories/base.repository";
import type { 
  ReportFilters, 
  TicketReport, 
  PerformanceReport, 
  SlaReport, 
  HourBankReport, 
  TrendReport 
} from "./types";

export class DashboardRepository extends BaseRepository {
  async getDashboardStats(tenantId: string): Promise<any> {
    return this.storage.getDashboardStats(tenantId);
  }

  async getTicketReports(tenantId: string, filters: ReportFilters): Promise<TicketReport> {
    return this.storage.getTicketReports(tenantId, filters);
  }

  async getPerformanceReports(tenantId: string, period?: string): Promise<PerformanceReport> {
    return this.storage.getPerformanceReports(tenantId, period);
  }

  async getSlaReports(tenantId: string, filters: ReportFilters): Promise<SlaReport> {
    return this.storage.getSlaReports(tenantId, filters);
  }

  async getHourBankReports(tenantId: string, customerId?: string): Promise<HourBankReport> {
    return this.storage.getHourBankReports(tenantId, customerId);
  }

  async getTrendReports(tenantId: string, options: { period?: string; metric?: string }): Promise<TrendReport> {
    return this.storage.getTrendReports(tenantId, options);
  }

  async exportReportsCsv(tenantId: string, reportType: string, filters: any): Promise<string> {
    return this.storage.exportReportsCsv(tenantId, reportType, filters);
  }
}