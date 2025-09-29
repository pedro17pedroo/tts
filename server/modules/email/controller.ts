import { type Request, type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { EmailService } from "./service";
import { z } from "zod";
import type { AuthenticatedRequest } from "../../shared/base-types";

// Schemas de validação
const createEmailConfigSchema = z.object({
  inboundEmail: z.string().email("E-mail inválido"),
  isActive: z.boolean().default(true),
  defaultDepartmentId: z.string().optional(),
  defaultCategoryId: z.string().optional(),
  defaultPriority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  autoAssignToAgent: z.boolean().default(false),
  defaultAssigneeId: z.string().optional(),
});

const updateEmailConfigSchema = createEmailConfigSchema.partial();

const processEmailSchema = z.object({
  from: z.string().email(),
  to: z.string().email(),
  subject: z.string(),
  text: z.string().optional(),
  html: z.string().optional(),
  messageId: z.string(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(), // Base64 encoded
    contentType: z.string(),
    size: z.number(),
  })).optional(),
});

export class EmailController extends BaseController {
  private service: EmailService;

  constructor() {
    super();
    this.service = new EmailService();
  }

  // Email Configuration Management
  async createEmailConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "Utilizador não associado a tenant");
      }

      const { tenantId } = authResult;
      const data = createEmailConfigSchema.parse(req.body);

      const emailConfig = await this.service.createEmailConfig(tenantId, data);
      this.sendSuccessWithStatus(res, 201, emailConfig, "Configuração de e-mail criada com sucesso");
    } catch (error) {
      this.handleError(error, res, "Falha ao criar configuração de e-mail");
    }
  }

  async getEmailConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "Utilizador não associado a tenant");
      }

      const { tenantId } = authResult;
      const emailConfig = await this.service.getEmailConfig(tenantId);
      
      if (!emailConfig) {
        return this.handleNotFound(res, "Configuração de e-mail não encontrada");
      }

      this.sendSuccess(res, emailConfig);
    } catch (error) {
      this.handleError(error, res, "Falha ao obter configuração de e-mail");
    }
  }

  async updateEmailConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "Utilizador não associado a tenant");
      }

      const { tenantId } = authResult;
      const data = updateEmailConfigSchema.parse(req.body);

      const emailConfig = await this.service.updateEmailConfig(tenantId, data);
      
      if (!emailConfig) {
        return this.handleNotFound(res, "Configuração de e-mail não encontrada");
      }

      this.sendSuccess(res, emailConfig, "Configuração de e-mail actualizada com sucesso");
    } catch (error) {
      this.handleError(error, res, "Falha ao actualizar configuração de e-mail");
    }
  }

  async deleteEmailConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "Utilizador não associado a tenant");
      }

      const { tenantId } = authResult;
      const success = await this.service.deleteEmailConfig(tenantId);
      
      if (!success) {
        return this.handleNotFound(res, "Configuração de e-mail não encontrada");
      }

      this.sendSuccess(res, null, "Configuração de e-mail removida com sucesso");
    } catch (error) {
      this.handleError(error, res, "Falha ao remover configuração de e-mail");
    }
  }

  // Email Processing (Webhook endpoint)
  async processInboundEmail(req: Request, res: Response) {
    try {
      const webhookSecret = req.headers['x-webhook-secret'] as string;
      const emailData = processEmailSchema.parse(req.body);

      // Convert base64 attachments to Buffer if present
      const processedEmailData = {
        ...emailData,
        attachments: emailData.attachments?.map(attachment => ({
          ...attachment,
          content: Buffer.from(attachment.content, 'base64'),
        })),
      };

      const result = await this.service.processInboundEmail(processedEmailData, webhookSecret);
      
      if (result.success) {
        return this.sendSuccess(res, { 
          ticketId: result.ticketId,
          logId: result.logId 
        }, "E-mail processado com sucesso");
      } else {
        return res.status(400).json({
          success: false,
          message: result.error || "Falha ao processar e-mail"
        });
      }
    } catch (error) {
      this.handleError(error, res, "Falha ao processar e-mail");
    }
  }

  // Email Logs
  async getEmailLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "Utilizador não associado a tenant");
      }

      const { tenantId } = authResult;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const emailLogs = await this.service.getEmailLogs(tenantId, limit);
      this.sendSuccess(res, emailLogs);
    } catch (error) {
      this.handleError(error, res, "Falha ao obter logs de e-mail");
    }
  }

  async getEmailLogsByStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const authResult = await this.getAuthenticatedUser(req);
      if (!authResult) {
        return this.handleUnauthorized(res, "Utilizador não associado a tenant");
      }

      const status = req.params.status;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const emailLogs = await this.service.getEmailLogsByStatus(status, limit);
      this.sendSuccess(res, emailLogs);
    } catch (error) {
      this.handleError(error, res, "Falha ao obter logs de e-mail por status");
    }
  }
}