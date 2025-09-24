import { BaseModuleService } from "../../shared/base-service";
import { SlaRepository } from "./repository";
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
  SlaLogFilters,
  SlaCalculationResult,
  BusinessHoursConfig,
  SlaAlert,
  SlaReportData,
  CreateSlaConfigParams,
  CalculateSlaParams,
  UpdateSlaStatusParams
} from "./types";

export class SlaService extends BaseModuleService {
  private repository: SlaRepository;

  constructor() {
    super();
    this.repository = new SlaRepository();
  }

  // SLA Configuration Management
  async getSlaConfigs(tenantId: string, filters?: SlaConfigFilters): Promise<SlaConfig[]> {
    return this.withErrorHandling('getSlaConfigs', async () => {
      return this.repository.getSlaConfigs(tenantId, filters);
    });
  }

  async getSlaConfig(id: string, tenantId: string): Promise<SlaConfig | undefined> {
    return this.withErrorHandling('getSlaConfig', async () => {
      return this.repository.getSlaConfig(id, tenantId);
    });
  }

  async createSlaConfig(params: CreateSlaConfigParams): Promise<SlaConfig> {
    return this.withErrorHandling('createSlaConfig', async () => {
      this.validateRequired(params, ['tenantId', 'priority', 'firstResponseMinutes', 'resolutionMinutes']);
      
      // Check for conflicts - only one config per tenant/priority/category combination
      const existingConfig = await this.repository.findApplicableSlaConfig(
        params.tenantId, 
        params.priority, 
        params.categoryId
      );
      
      if (existingConfig) {
        throw new Error(`SLA configuration already exists for this priority${params.categoryId ? ' and category' : ''}`);
      }

      const slaConfigData: InsertSlaConfig = {
        tenantId: params.tenantId,
        categoryId: params.categoryId || null,
        priority: params.priority,
        firstResponseMinutes: params.firstResponseMinutes,
        resolutionMinutes: params.resolutionMinutes,
        businessHoursStart: params.businessHoursStart || '09:00',
        businessHoursEnd: params.businessHoursEnd || '18:00',
        businessDays: params.businessDays || [1, 2, 3, 4, 5], // Monday to Friday
        timezone: params.timezone || 'America/Sao_Paulo',
        isActive: true
      };

      const slaConfig = await this.repository.createSlaConfig(slaConfigData);
      
      // Log creation
      await this.logSlaEvent({
        tenantId: params.tenantId,
        slaConfigId: slaConfig.id,
        action: 'created',
        eventType: 'config_created',
        description: `SLA config created for priority ${params.priority}${params.categoryId ? ` and category ${params.categoryId}` : ''}`,
        newValues: slaConfigData
      });

      return slaConfig;
    });
  }

  async updateSlaConfig(id: string, tenantId: string, updates: Partial<SlaConfig>): Promise<SlaConfig> {
    return this.withErrorHandling('updateSlaConfig', async () => {
      const existingConfig = await this.repository.getSlaConfig(id, tenantId);
      if (!existingConfig) {
        throw new Error('SLA configuration not found');
      }

      const updatedConfig = await this.repository.updateSlaConfig(id, updates);
      
      // Log update
      await this.logSlaEvent({
        tenantId,
        slaConfigId: id,
        action: 'updated',
        eventType: 'config_updated',
        description: 'SLA config updated',
        oldValues: existingConfig,
        newValues: updates
      });

      return updatedConfig;
    });
  }

  async deleteSlaConfig(id: string, tenantId: string): Promise<void> {
    return this.withErrorHandling('deleteSlaConfig', async () => {
      const existingConfig = await this.repository.getSlaConfig(id, tenantId);
      if (!existingConfig) {
        throw new Error('SLA configuration not found');
      }

      await this.repository.deleteSlaConfig(id, tenantId);
      
      // Log deletion
      await this.logSlaEvent({
        tenantId,
        slaConfigId: id,
        action: 'deleted',
        eventType: 'config_deleted',
        description: `SLA config deleted for priority ${existingConfig.priority}`,
        oldValues: existingConfig
      });
    });
  }

  // SLA Calculation Engine
  async calculateSlaForTicket(params: CalculateSlaParams): Promise<SlaCalculationResult> {
    return this.withErrorHandling('calculateSlaForTicket', async () => {
      const { ticketId, tenantId, priority, categoryId, createdAt, currentTime = new Date() } = params;

      // Find applicable SLA config
      const slaConfig = await this.repository.findApplicableSlaConfig(tenantId, priority, categoryId);
      if (!slaConfig) {
        throw new Error(`No SLA configuration found for priority ${priority}${categoryId ? ` and category ${categoryId}` : ''}`);
      }

      const businessHours: BusinessHoursConfig = {
        start: slaConfig.businessHoursStart,
        end: slaConfig.businessHoursEnd,
        days: slaConfig.businessDays as number[],
        timezone: slaConfig.timezone
      };

      // Calculate due dates considering business hours
      const firstResponseDueAt = this.calculateDueDate(
        createdAt,
        slaConfig.firstResponseMinutes,
        businessHours
      );

      const resolutionDueAt = this.calculateDueDate(
        createdAt,
        slaConfig.resolutionMinutes,
        businessHours
      );

      // Calculate time remaining and status
      const firstResponseTimeRemaining = this.calculateTimeRemaining(currentTime, firstResponseDueAt, businessHours);
      const resolutionTimeRemaining = this.calculateTimeRemaining(currentTime, resolutionDueAt, businessHours);

      // Determine status based on time remaining
      const firstResponseStatus = this.determineSlaStatus(firstResponseTimeRemaining, slaConfig.firstResponseMinutes);
      const resolutionStatus = this.determineSlaStatus(resolutionTimeRemaining, slaConfig.resolutionMinutes);

      return {
        ticketId,
        slaConfigId: slaConfig.id,
        firstResponseDueAt,
        resolutionDueAt,
        firstResponseStatus,
        resolutionStatus,
        firstResponseTimeRemaining,
        resolutionTimeRemaining,
        isBusinessHours: this.isWithinBusinessHours(currentTime, businessHours)
      };
    });
  }

  async updateSlaStatus(params: UpdateSlaStatusParams): Promise<SlaStatus> {
    return this.withErrorHandling('updateSlaStatus', async () => {
      const { ticketId, firstResponseAt, resolvedAt, currentTime = new Date() } = params;

      let slaStatus = await this.repository.getSlaStatusByTicket(ticketId);
      if (!slaStatus) {
        throw new Error('SLA status not found for ticket');
      }

      const updates: Partial<SlaStatus> = {};

      // Update first response
      if (firstResponseAt && !slaStatus.firstResponseAt) {
        updates.firstResponseAt = firstResponseAt;
        
        // Calculate actual response time
        const responseTime = this.calculateBusinessMinutes(
          new Date(slaStatus.createdAt!),
          firstResponseAt,
          await this.getBusinessHoursFromConfig(slaStatus.slaConfigId!)
        );
        
        updates.firstResponseTimeSpent = responseTime;
        updates.firstResponseStatus = responseTime <= (slaStatus.firstResponseTimeRemaining || 0) ? 'compliant' : 'breached';
        
        if (updates.firstResponseStatus === 'breached') {
          updates.firstResponseBreachedAt = firstResponseAt;
          
          // Log breach
          await this.logSlaEvent({
            tenantId: (await this.getTicketTenantId(ticketId))!,
            ticketId,
            slaStatusId: slaStatus.id,
            action: 'violation',
            eventType: 'first_response_breach',
            description: `First response SLA breached after ${responseTime} minutes`,
            responseTime
          });
        }
      }

      // Update resolution
      if (resolvedAt && !slaStatus.resolvedAt) {
        updates.resolvedAt = resolvedAt;
        
        // Calculate actual resolution time
        const resolutionTime = this.calculateBusinessMinutes(
          new Date(slaStatus.createdAt!),
          resolvedAt,
          await this.getBusinessHoursFromConfig(slaStatus.slaConfigId!)
        );
        
        updates.resolutionTimeSpent = resolutionTime;
        updates.resolutionStatus = resolutionTime <= (slaStatus.resolutionTimeRemaining || 0) ? 'compliant' : 'breached';
        
        if (updates.resolutionStatus === 'breached') {
          updates.resolutionBreachedAt = resolvedAt;
          
          // Log breach
          await this.logSlaEvent({
            tenantId: (await this.getTicketTenantId(ticketId))!,
            ticketId,
            slaStatusId: slaStatus.id,
            action: 'violation',
            eventType: 'resolution_breach',
            description: `Resolution SLA breached after ${resolutionTime} minutes`,
            resolutionTime
          });
        } else {
          // Log successful resolution
          await this.logSlaEvent({
            tenantId: (await this.getTicketTenantId(ticketId))!,
            ticketId,
            slaStatusId: slaStatus.id,
            action: 'resolution',
            eventType: 'resolution_compliant',
            description: `Ticket resolved within SLA (${resolutionTime} minutes)`,
            resolutionTime
          });
        }
      }

      return this.repository.updateSlaStatus(slaStatus.id, updates);
    });
  }

  // Alert System
  async generateSlaAlerts(tenantId: string): Promise<SlaAlert[]> {
    return this.withErrorHandling('generateSlaAlerts', async () => {
      const atRiskStatuses = await this.repository.getSlaStatusesAtRisk(tenantId);
      const breachedStatuses = await this.repository.getSlaStatusesBreached(tenantId);
      
      const alerts: SlaAlert[] = [];
      const currentTime = new Date();

      // Generate alerts for at-risk tickets
      for (const status of atRiskStatuses) {
        // First response alerts
        if (status.firstResponseStatus === 'at_risk' && !status.firstResponseAt) {
          const timeRemaining = status.firstResponseTimeRemaining || 0;
          const totalTime = timeRemaining + (status.firstResponseTimeSpent || 0);
          const percentage = Math.round((1 - timeRemaining / totalTime) * 100);
          
          alerts.push({
            id: `fr_${status.id}`,
            ticketId: status.ticketId,
            type: 'first_response_warning',
            priority: 'high', // Get from ticket
            percentage,
            timeRemaining,
            dueAt: status.firstResponseDueAt!,
            message: `First response SLA at risk (${percentage}% consumed)`,
            createdAt: currentTime
          });
        }

        // Resolution alerts
        if (status.resolutionStatus === 'at_risk' && !status.resolvedAt) {
          const timeRemaining = status.resolutionTimeRemaining || 0;
          const totalTime = timeRemaining + (status.resolutionTimeSpent || 0);
          const percentage = Math.round((1 - timeRemaining / totalTime) * 100);
          
          alerts.push({
            id: `res_${status.id}`,
            ticketId: status.ticketId,
            type: 'resolution_warning',
            priority: 'high', // Get from ticket
            percentage,
            timeRemaining,
            dueAt: status.resolutionDueAt!,
            message: `Resolution SLA at risk (${percentage}% consumed)`,
            createdAt: currentTime
          });
        }
      }

      // Generate alerts for breached tickets
      for (const status of breachedStatuses) {
        if (status.firstResponseStatus === 'breached' && !status.firstResponseAt) {
          alerts.push({
            id: `fr_breach_${status.id}`,
            ticketId: status.ticketId,
            type: 'first_response_breach',
            priority: 'critical',
            percentage: 100,
            timeRemaining: 0,
            dueAt: status.firstResponseDueAt!,
            message: 'First response SLA breached',
            createdAt: status.firstResponseBreachedAt || currentTime
          });
        }

        if (status.resolutionStatus === 'breached' && !status.resolvedAt) {
          alerts.push({
            id: `res_breach_${status.id}`,
            ticketId: status.ticketId,
            type: 'resolution_breach',
            priority: 'critical',
            percentage: 100,
            timeRemaining: 0,
            dueAt: status.resolutionDueAt!,
            message: 'Resolution SLA breached',
            createdAt: status.resolutionBreachedAt || currentTime
          });
        }
      }

      return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });
  }

  // Reports and Analytics
  async generateSlaReport(tenantId: string, startDate: Date, endDate: Date): Promise<SlaReportData> {
    return this.withErrorHandling('generateSlaReport', async () => {
      const stats = await this.repository.getSlaComplianceStats(tenantId);
      
      // This would typically involve more complex queries
      // For now, returning basic structure
      return {
        period: {
          start: startDate,
          end: endDate
        },
        summary: {
          totalTickets: stats.total,
          compliantTickets: stats.compliant,
          atRiskTickets: stats.atRisk,
          breachedTickets: stats.breached,
          complianceRate: stats.complianceRate
        },
        byPriority: [
          { priority: 'low', total: 0, compliant: 0, breached: 0, rate: 0 },
          { priority: 'medium', total: 0, compliant: 0, breached: 0, rate: 0 },
          { priority: 'high', total: 0, compliant: 0, breached: 0, rate: 0 },
          { priority: 'critical', total: 0, compliant: 0, breached: 0, rate: 0 }
        ],
        byCategory: [],
        trends: []
      };
    });
  }

  // Helper Methods
  private calculateDueDate(startDate: Date, minutes: number, businessHours: BusinessHoursConfig): Date {
    // Simple implementation - in production, would use a proper business hours library
    const dueDate = new Date(startDate);
    dueDate.setMinutes(dueDate.getMinutes() + minutes);
    return dueDate;
  }

  private calculateTimeRemaining(currentTime: Date, dueDate: Date, businessHours: BusinessHoursConfig): number {
    const remaining = dueDate.getTime() - currentTime.getTime();
    return Math.max(0, Math.floor(remaining / (1000 * 60))); // Convert to minutes
  }

  private calculateBusinessMinutes(startDate: Date, endDate: Date, businessHours: BusinessHoursConfig): number {
    // Simple implementation - in production, would properly calculate business minutes
    const diff = endDate.getTime() - startDate.getTime();
    return Math.floor(diff / (1000 * 60));
  }

  private determineSlaStatus(timeRemaining: number, totalMinutes: number): 'compliant' | 'at_risk' | 'breached' {
    if (timeRemaining <= 0) {
      return 'breached';
    }
    
    const percentage = (timeRemaining / totalMinutes) * 100;
    if (percentage <= 25) { // Less than 25% time remaining
      return 'at_risk';
    }
    
    return 'compliant';
  }

  private isWithinBusinessHours(date: Date, businessHours: BusinessHoursConfig): boolean {
    const day = date.getDay();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const timeInMinutes = hour * 60 + minutes;
    
    const [startHour, startMin] = businessHours.start.split(':').map(Number);
    const [endHour, endMin] = businessHours.end.split(':').map(Number);
    const startInMinutes = startHour * 60 + startMin;
    const endInMinutes = endHour * 60 + endMin;
    
    return businessHours.days.includes(day) && 
           timeInMinutes >= startInMinutes && 
           timeInMinutes <= endInMinutes;
  }

  private async getBusinessHoursFromConfig(slaConfigId: string): Promise<BusinessHoursConfig> {
    // In a real implementation, this would fetch the config
    return {
      start: '09:00',
      end: '18:00',
      days: [1, 2, 3, 4, 5],
      timezone: 'America/Sao_Paulo'
    };
  }

  private async getTicketTenantId(ticketId: string): Promise<string | undefined> {
    // In a real implementation, this would fetch the ticket's tenant ID
    return undefined;
  }

  private async logSlaEvent(params: {
    tenantId: string;
    ticketId?: string;
    slaConfigId?: string;
    slaStatusId?: string;
    action: 'created' | 'updated' | 'deleted' | 'violation' | 'resolution';
    eventType: string;
    description: string;
    oldValues?: any;
    newValues?: any;
    responseTime?: number;
    resolutionTime?: number;
    userId?: string;
  }): Promise<void> {
    const logData: InsertSlaLog = {
      tenantId: params.tenantId,
      ticketId: params.ticketId || null,
      slaConfigId: params.slaConfigId || null,
      slaStatusId: params.slaStatusId || null,
      action: params.action,
      eventType: params.eventType,
      description: params.description,
      oldValues: params.oldValues || null,
      newValues: params.newValues || null,
      responseTime: params.responseTime || null,
      resolutionTime: params.resolutionTime || null,
      userId: params.userId || null,
      metadata: null
    };

    await this.repository.createSlaLog(logData);
  }

  // Bulk Operations
  async recalculateAllSlaStatuses(tenantId: string): Promise<{ updated: number; errors: number }> {
    return this.withErrorHandling('recalculateAllSlaStatuses', async () => {
      // This would typically recalculate SLA for all active tickets
      // Implementation depends on ticket integration
      return { updated: 0, errors: 0 };
    });
  }

  // Integration Preparation Methods
  async onTicketCreated(ticket: Ticket): Promise<SlaStatus | null> {
    // This will be called when a ticket is created
    try {
      const calculation = await this.calculateSlaForTicket({
        ticketId: ticket.id,
        tenantId: ticket.tenantId,
        priority: ticket.priority,
        categoryId: ticket.categoryId || undefined,
        createdAt: ticket.createdAt!
      });

      const slaStatusData: InsertSlaStatus = {
        ticketId: ticket.id,
        slaConfigId: calculation.slaConfigId,
        firstResponseDueAt: calculation.firstResponseDueAt,
        resolutionDueAt: calculation.resolutionDueAt,
        firstResponseStatus: calculation.firstResponseStatus,
        resolutionStatus: calculation.resolutionStatus,
        firstResponseTimeRemaining: calculation.firstResponseTimeRemaining,
        resolutionTimeRemaining: calculation.resolutionTimeRemaining
      };

      const slaStatus = await this.repository.createSlaStatus(slaStatusData);
      
      // Log SLA tracking started
      await this.logSlaEvent({
        tenantId: ticket.tenantId,
        ticketId: ticket.id,
        slaConfigId: calculation.slaConfigId,
        slaStatusId: slaStatus.id,
        action: 'created',
        eventType: 'sla_tracking_started',
        description: `SLA tracking started for ticket ${ticket.id}`,
        newValues: slaStatusData
      });

      return slaStatus;
    } catch (error) {
      this.logError('onTicketCreated', error);
      return null;
    }
  }

  async onTicketFirstResponse(ticketId: string, responseTime: Date): Promise<void> {
    await this.updateSlaStatus({
      ticketId,
      firstResponseAt: responseTime
    });
  }

  async onTicketResolved(ticketId: string, resolvedTime: Date): Promise<void> {
    await this.updateSlaStatus({
      ticketId,
      resolvedAt: resolvedTime
    });
  }

  // Additional Service Methods for Controller Support

  async getSlaStatus(ticketId: string): Promise<SlaStatus | undefined> {
    return this.withErrorHandling('getSlaStatus', async () => {
      return this.repository.getSlaStatusByTicket(ticketId);
    });
  }

  async getSlaStatusDetails(ticketId: string, tenantId: string): Promise<{
    slaStatus: SlaStatus;
    ticket?: Ticket;
    slaConfig?: SlaConfig;
  } | null> {
    return this.withErrorHandling('getSlaStatusDetails', async () => {
      const slaStatus = await this.repository.getSlaStatusByTicket(ticketId);
      if (!slaStatus) {
        return null;
      }

      // Get SLA config if available
      let slaConfig: SlaConfig | undefined;
      if (slaStatus.slaConfigId) {
        slaConfig = await this.repository.getSlaConfig(slaStatus.slaConfigId, tenantId);
      }

      // In a real implementation, we would also fetch the ticket details
      // For now, returning basic structure
      return {
        slaStatus,
        slaConfig
      };
    });
  }

  async getSlaStatuses(tenantId: string, filters?: SlaStatusFilters): Promise<SlaStatus[]> {
    return this.withErrorHandling('getSlaStatuses', async () => {
      return this.repository.getSlaStatusesByTenant(tenantId, filters);
    });
  }

  async getSlaLogs(tenantId: string, filters?: SlaLogFilters): Promise<SlaLogs[]> {
    return this.withErrorHandling('getSlaLogs', async () => {
      return this.repository.getSlaLogs(tenantId, filters);
    });
  }

  async getSlaLogsByTicket(ticketId: string): Promise<SlaLogs[]> {
    return this.withErrorHandling('getSlaLogsByTicket', async () => {
      return this.repository.getSlaLogsByTicket(ticketId);
    });
  }

  async getSlaStatistics(tenantId: string): Promise<{
    overview: {
      totalConfigs: number;
      activeConfigs: number;
      totalTicketsTracked: number;
    };
    compliance: {
      total: number;
      compliant: number;
      atRisk: number;
      breached: number;
      complianceRate: number;
    };
    alerts: {
      total: number;
      warnings: number;
      breaches: number;
    };
    trends: {
      dailyCompliance: number;
      weeklyCompliance: number;
      monthlyCompliance: number;
    };
  }> {
    return this.withErrorHandling('getSlaStatistics', async () => {
      const configs = await this.repository.getSlaConfigs(tenantId);
      const activeConfigs = configs.filter(c => c.isActive);
      const complianceStats = await this.repository.getSlaComplianceStats(tenantId);
      const alerts = await this.generateSlaAlerts(tenantId);
      const atRiskStatuses = await this.repository.getSlaStatusesAtRisk(tenantId);
      const breachedStatuses = await this.repository.getSlaStatusesBreached(tenantId);

      const warnings = alerts.filter(a => a.type.includes('warning')).length;
      const breaches = alerts.filter(a => a.type.includes('breach')).length;

      return {
        overview: {
          totalConfigs: configs.length,
          activeConfigs: activeConfigs.length,
          totalTicketsTracked: complianceStats.total
        },
        compliance: complianceStats,
        alerts: {
          total: alerts.length,
          warnings,
          breaches
        },
        trends: {
          // In a real implementation, these would be calculated from historical data
          dailyCompliance: complianceStats.complianceRate,
          weeklyCompliance: complianceStats.complianceRate,
          monthlyCompliance: complianceStats.complianceRate
        }
      };
    });
  }
}