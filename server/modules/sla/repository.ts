import { BaseRepository } from "../../repositories/base.repository";
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
  SlaConfigFilters, 
  SlaStatusFilters, 
  SlaLogFilters 
} from "./types";

export class SlaRepository extends BaseRepository {
  
  // SLA Config operations
  async getSlaConfigs(tenantId: string, filters?: SlaConfigFilters): Promise<SlaConfig[]> {
    return this.withErrorHandling('getSlaConfigs', async () => {
      return this.storage.getSlaConfigs(tenantId, filters);
    });
  }

  async getSlaConfig(id: string, tenantId: string): Promise<SlaConfig | undefined> {
    return this.withErrorHandling('getSlaConfig', async () => {
      return this.storage.getSlaConfig(id, tenantId);
    });
  }

  async getSlaConfigByPriorityAndCategory(
    tenantId: string, 
    priority: 'low' | 'medium' | 'high' | 'critical', 
    categoryId?: string
  ): Promise<SlaConfig | undefined> {
    return this.withErrorHandling('getSlaConfigByPriorityAndCategory', async () => {
      return this.storage.getSlaConfigByTenantAndPriority(tenantId, priority, categoryId);
    });
  }

  async createSlaConfig(slaConfigData: InsertSlaConfig): Promise<SlaConfig> {
    return this.withErrorHandling('createSlaConfig', async () => {
      return this.storage.createSlaConfig(slaConfigData);
    });
  }

  async updateSlaConfig(id: string, updates: Partial<SlaConfig>): Promise<SlaConfig> {
    return this.withErrorHandling('updateSlaConfig', async () => {
      return this.storage.updateSlaConfig(id, updates);
    });
  }

  async deleteSlaConfig(id: string, tenantId: string): Promise<void> {
    return this.withErrorHandling('deleteSlaConfig', async () => {
      return this.storage.deleteSlaConfig(id, tenantId);
    });
  }

  // SLA Status operations
  async getSlaStatusByTicket(ticketId: string): Promise<SlaStatus | undefined> {
    return this.withErrorHandling('getSlaStatusByTicket', async () => {
      return this.storage.getSlaStatusByTicket(ticketId);
    });
  }

  async getSlaStatusesByTenant(tenantId: string, filters?: SlaStatusFilters): Promise<SlaStatus[]> {
    return this.withErrorHandling('getSlaStatusesByTenant', async () => {
      return this.storage.getSlaStatusesByTenant(tenantId, filters);
    });
  }

  async createSlaStatus(slaStatusData: InsertSlaStatus): Promise<SlaStatus> {
    return this.withErrorHandling('createSlaStatus', async () => {
      return this.storage.createSlaStatus(slaStatusData);
    });
  }

  async updateSlaStatus(id: string, updates: Partial<SlaStatus>): Promise<SlaStatus> {
    return this.withErrorHandling('updateSlaStatus', async () => {
      return this.storage.updateSlaStatus(id, updates);
    });
  }

  async getSlaStatusesAtRisk(tenantId: string): Promise<SlaStatus[]> {
    return this.withErrorHandling('getSlaStatusesAtRisk', async () => {
      return this.storage.getSlaStatusesAtRisk(tenantId);
    });
  }

  async getSlaStatusesBreached(tenantId: string): Promise<SlaStatus[]> {
    return this.withErrorHandling('getSlaStatusesBreached', async () => {
      return this.storage.getSlaStatusesBreached(tenantId);
    });
  }

  // SLA Logs operations
  async getSlaLogs(tenantId: string, filters?: SlaLogFilters): Promise<SlaLogs[]> {
    return this.withErrorHandling('getSlaLogs', async () => {
      return this.storage.getSlaLogs(tenantId, filters);
    });
  }

  async getSlaLogsByTicket(ticketId: string): Promise<SlaLogs[]> {
    return this.withErrorHandling('getSlaLogsByTicket', async () => {
      return this.storage.getSlaLogsByTicket(ticketId);
    });
  }

  async createSlaLog(slaLogData: InsertSlaLog): Promise<SlaLogs> {
    return this.withErrorHandling('createSlaLog', async () => {
      return this.storage.createSlaLog(slaLogData);
    });
  }

  // Additional query methods for reports and analytics
  async getSlaConfigsActiveByTenant(tenantId: string): Promise<SlaConfig[]> {
    return this.withErrorHandling('getSlaConfigsActiveByTenant', async () => {
      return this.storage.getSlaConfigs(tenantId, { isActive: true });
    });
  }

  async getSlaStatusesDueToday(tenantId: string): Promise<SlaStatus[]> {
    return this.withErrorHandling('getSlaStatusesDueToday', async () => {
      return this.storage.getSlaStatusesByTenant(tenantId, { dueToday: true });
    });
  }

  async getSlaStatusesOverdue(tenantId: string): Promise<SlaStatus[]> {
    return this.withErrorHandling('getSlaStatusesOverdue', async () => {
      return this.storage.getSlaStatusesByTenant(tenantId, { overdue: true });
    });
  }

  async getSlaLogsByDateRange(tenantId: string, dateFrom: string, dateTo: string): Promise<SlaLogs[]> {
    return this.withErrorHandling('getSlaLogsByDateRange', async () => {
      return this.storage.getSlaLogs(tenantId, { dateFrom, dateTo });
    });
  }

  async getSlaLogsByAction(tenantId: string, action: 'created' | 'updated' | 'deleted' | 'violation' | 'resolution'): Promise<SlaLogs[]> {
    return this.withErrorHandling('getSlaLogsByAction', async () => {
      return this.storage.getSlaLogs(tenantId, { action });
    });
  }

  async getSlaViolationLogs(tenantId: string): Promise<SlaLogs[]> {
    return this.withErrorHandling('getSlaViolationLogs', async () => {
      return this.storage.getSlaLogs(tenantId, { action: 'violation' });
    });
  }

  // Helper methods for complex queries
  async findApplicableSlaConfig(
    tenantId: string, 
    priority: 'low' | 'medium' | 'high' | 'critical', 
    categoryId?: string
  ): Promise<SlaConfig | undefined> {
    return this.withErrorHandling('findApplicableSlaConfig', async () => {
      // First try to find config for specific category
      if (categoryId) {
        const specificConfig = await this.storage.getSlaConfigByTenantAndPriority(tenantId, priority, categoryId);
        if (specificConfig) {
          return specificConfig;
        }
      }
      
      // Fall back to general config (category = null)
      return this.storage.getSlaConfigByTenantAndPriority(tenantId, priority, undefined);
    });
  }

  async getSlaComplianceStats(tenantId: string): Promise<{
    total: number;
    compliant: number;
    atRisk: number;
    breached: number;
    complianceRate: number;
  }> {
    return this.withErrorHandling('getSlaComplianceStats', async () => {
      const allStatuses = await this.storage.getSlaStatusesByTenant(tenantId);
      const atRisk = await this.storage.getSlaStatusesAtRisk(tenantId);
      const breached = await this.storage.getSlaStatusesBreached(tenantId);
      
      const total = allStatuses.length;
      const atRiskCount = atRisk.length;
      const breachedCount = breached.length;
      const compliant = total - atRiskCount - breachedCount;
      const complianceRate = total > 0 ? (compliant / total) * 100 : 100;

      return {
        total,
        compliant,
        atRisk: atRiskCount,
        breached: breachedCount,
        complianceRate: Math.round(complianceRate * 100) / 100
      };
    });
  }
}