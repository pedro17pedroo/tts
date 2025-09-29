import { type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { SlaService } from "./service";
import { 
  insertSlaStatusSchema, 
  insertSlaLogSchema 
} from "../../schema";
import { z } from "zod";

// Simple validation schema for SLA Config
const createSlaConfigSchema = z.object({
  categoryId: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  firstResponseMinutes: z.number().positive(),
  resolutionMinutes: z.number().positive(),
  businessHoursStart: z.string().default("09:00"),
  businessHoursEnd: z.string().default("18:00"),
  businessDays: z.array(z.number()).default([1, 2, 3, 4, 5]),
  timezone: z.string().default("Africa/Luanda"),
  isActive: z.boolean().default(true),
});
import type { 
  AuthenticatedRequest,
  SlaConfigsResponse,
  SlaConfigResponse,
  SlaStatusResponse,
  SlaStatusWithTicketResponse,
  SlaAlertsResponse,
  SlaReportResponse,
  SlaLogsResponse,
  SlaOperationResponse,
  SlaConfigFilters,
  SlaStatusFilters,
  SlaLogFilters,
  CreateSlaConfigParams
} from "./types";

export class SlaController extends BaseController {
  private service: SlaService;

  constructor() {
    super();
    this.service = new SlaService();
  }

  // SLA Configuration Management

  async getSlaConfigs(req: AuthenticatedRequest, res: Response<SlaConfigsResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const filters: SlaConfigFilters = {
        categoryId: req.query.categoryId as string,
        priority: req.query.priority as any,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      };

      const slaConfigs = await this.service.getSlaConfigs(tenantId, filters);
      this.sendSuccess(res, slaConfigs);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA configurations");
    }
  }

  async getSlaConfig(req: AuthenticatedRequest, res: Response<SlaConfigResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const slaConfig = await this.service.getSlaConfig(req.params.id, tenantId);
      
      if (!slaConfig) {
        return this.handleNotFound(res, "SLA configuration not found");
      }

      this.sendSuccess(res, slaConfig);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA configuration");
    }
  }

  async createSlaConfig(req: AuthenticatedRequest, res: Response<SlaConfigResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const validatedData = createSlaConfigSchema.parse(req.body);
      
      const params: CreateSlaConfigParams = {
        tenantId,
        ...validatedData,
      };

      const slaConfig = await this.service.createSlaConfig(params);
      this.sendSuccessWithStatus(res, 201, slaConfig, "SLA configuration created successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.handleValidationError(error, res);
      }
      this.handleError(error, res, "Failed to create SLA configuration");
    }
  }

  async updateSlaConfig(req: AuthenticatedRequest, res: Response<SlaConfigResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;

      // Validate request body
      const updateSlaConfigSchema = z.object({
        firstResponseMinutes: z.number().min(1).optional(),
        resolutionMinutes: z.number().min(1).optional(),
        businessHoursStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        businessHoursEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        businessDays: z.array(z.number().min(1).max(7)).optional(),
        timezone: z.string().optional(),
        isActive: z.boolean().optional(),
      });

      const validatedData = updateSlaConfigSchema.parse(req.body);
      
      const slaConfig = await this.service.updateSlaConfig(req.params.id, tenantId, validatedData);
      this.sendSuccess(res, slaConfig, "SLA configuration updated successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.handleValidationError(error, res);
      }
      this.handleError(error, res, "Failed to update SLA configuration");
    }
  }

  async deleteSlaConfig(req: AuthenticatedRequest, res: Response<SlaOperationResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      await this.service.deleteSlaConfig(req.params.id, tenantId);
      
      this.sendSuccess(res, { message: "SLA configuration deleted successfully" });
    } catch (error) {
      this.handleError(error, res, "Failed to delete SLA configuration");
    }
  }

  // SLA Status Management

  async getSlaStatusByTicket(req: AuthenticatedRequest, res: Response<SlaStatusWithTicketResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const ticketId = req.params.ticketId;

      // Get SLA status
      const slaStatus = await this.service.getSlaStatus(ticketId);
      if (!slaStatus) {
        return this.handleNotFound(res, "SLA status not found for this ticket");
      }

      // Get associated ticket and config info
      const result = await this.service.getSlaStatusDetails(ticketId, tenantId);
      if (!result) {
        return this.handleNotFound(res, "SLA status details not found");
      }

      this.sendSuccess(res, result);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA status");
    }
  }

  async getSlaStatuses(req: AuthenticatedRequest, res: Response<SlaStatusResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const filters: SlaStatusFilters = {
        status: req.query.status as any,
        dueToday: req.query.dueToday === 'true',
        overdue: req.query.overdue === 'true',
      };

      const slaStatuses = await this.service.getSlaStatuses(tenantId, filters);
      this.sendSuccess(res, slaStatuses);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA statuses");
    }
  }

  // SLA Calculation and Recalculation

  async calculateSlaForTicket(req: AuthenticatedRequest, res: Response<SlaOperationResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;

      const calculateSchema = z.object({
        ticketId: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        categoryId: z.string().optional(),
        createdAt: z.string().transform(str => new Date(str)),
      });

      const validatedData = calculateSchema.parse(req.body);
      
      const calculation = await this.service.calculateSlaForTicket({
        ...validatedData,
        tenantId,
      });

      this.sendSuccess(res, { 
        message: "SLA calculated successfully",
        calculation 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.handleValidationError(error, res);
      }
      this.handleError(error, res, "Failed to calculate SLA");
    }
  }

  async recalculateAllSlas(req: AuthenticatedRequest, res: Response<SlaOperationResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      // Check if user has admin role
      if (authResult.user.role !== 'tenant_admin' && authResult.user.role !== 'global_admin') {
        return this.handleForbidden(res, "Only administrators can recalculate all SLAs");
      }

      const { tenantId } = authResult;
      const result = await this.service.recalculateAllSlaStatuses(tenantId);
      
      this.sendSuccess(res, {
        message: `SLA recalculation completed. Updated: ${result.updated}, Errors: ${result.errors}`
      });
    } catch (error) {
      this.handleError(error, res, "Failed to recalculate SLAs");
    }
  }

  // SLA Alerts

  async getSlaAlerts(req: AuthenticatedRequest, res: Response<SlaAlertsResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const alerts = await this.service.generateSlaAlerts(tenantId);
      
      this.sendSuccess(res, alerts);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA alerts");
    }
  }

  // SLA Reports

  async getSlaReport(req: AuthenticatedRequest, res: Response<SlaReportResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;

      const reportSchema = z.object({
        startDate: z.string().transform(str => new Date(str)),
        endDate: z.string().transform(str => new Date(str)),
      });

      const { startDate, endDate } = reportSchema.parse(req.query);
      
      const report = await this.service.generateSlaReport(tenantId, startDate, endDate);
      this.sendSuccess(res, report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.handleValidationError(error, res);
      }
      this.handleError(error, res, "Failed to generate SLA report");
    }
  }

  // SLA Logs and Audit Trail

  async getSlaLogs(req: AuthenticatedRequest, res: Response<SlaLogsResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const filters: SlaLogFilters = {
        ticketId: req.query.ticketId as string,
        action: req.query.action as any,
        eventType: req.query.eventType as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
      };

      const logs = await this.service.getSlaLogs(tenantId, filters);
      this.sendSuccess(res, logs);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA logs");
    }
  }

  async getSlaLogsByTicket(req: AuthenticatedRequest, res: Response<SlaLogsResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const ticketId = req.params.ticketId;
      const logs = await this.service.getSlaLogsByTicket(ticketId);
      
      this.sendSuccess(res, logs);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA logs for ticket");
    }
  }

  // Dashboard and Statistics

  async getSlaStatistics(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const { tenantId } = authResult;
      const stats = await this.service.getSlaStatistics(tenantId);
      
      this.sendSuccess(res, stats);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch SLA statistics");
    }
  }

  // SLA Status Updates (for webhook/integration use)
  
  async updateSlaStatus(req: AuthenticatedRequest, res: Response<SlaOperationResponse>) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "User not associated with tenant");
      }

      const updateSchema = z.object({
        ticketId: z.string(),
        firstResponseAt: z.string().transform(str => new Date(str)).optional(),
        resolvedAt: z.string().transform(str => new Date(str)).optional(),
      });

      const validatedData = updateSchema.parse(req.body);
      
      const result = await this.service.updateSlaStatus(validatedData);
      this.sendSuccess(res, { 
        message: "SLA status updated successfully",
        slaStatus: result 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.handleValidationError(error, res);
      }
      this.handleError(error, res, "Failed to update SLA status");
    }
  }
}