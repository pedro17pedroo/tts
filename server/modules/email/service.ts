import { EmailRepository } from "./repository";
import { TicketsService } from "../tickets/service";
import { CustomersService } from "../customers/service";
import { EmailConfig, InsertEmailConfig, InsertEmailLog } from "../../schema";
import { BaseModuleService } from "../../shared/base-service";
import crypto from "crypto";

interface InboundEmailData {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  messageId: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
    size: number;
  }>;
}

interface EmailProcessingResult {
  success: boolean;
  ticketId?: string;
  error?: string;
  logId: string;
}

export class EmailService extends BaseModuleService {
  private emailRepository: EmailRepository;
  private ticketsService: TicketsService;
  private customersService: CustomersService;

  constructor() {
    super();
    this.emailRepository = new EmailRepository();
    this.ticketsService = new TicketsService();
    this.customersService = new CustomersService();
  }

  // Email Configuration Management
  async createEmailConfig(tenantId: string, data: Omit<InsertEmailConfig, 'tenantId' | 'webhookSecret'>): Promise<EmailConfig> {
    const webhookSecret = this.generateWebhookSecret();
    
    const configData: InsertEmailConfig = {
      ...data,
      tenantId,
      webhookSecret,
    };

    return await this.emailRepository.createEmailConfig(configData);
  }

  async getEmailConfig(tenantId: string): Promise<EmailConfig | null> {
    return await this.emailRepository.getEmailConfigByTenant(tenantId);
  }

  async updateEmailConfig(tenantId: string, data: Partial<InsertEmailConfig>): Promise<EmailConfig | null> {
    return await this.emailRepository.updateEmailConfig(tenantId, data);
  }

  async deleteEmailConfig(tenantId: string): Promise<boolean> {
    return await this.emailRepository.deleteEmailConfig(tenantId);
  }

  // Email Processing
  async processInboundEmail(emailData: InboundEmailData, webhookSecret?: string): Promise<EmailProcessingResult> {
    // Create initial log entry
    const logData: InsertEmailLog = {
      fromEmail: emailData.from,
      toEmail: emailData.to,
      subject: emailData.subject,
      messageId: emailData.messageId,
      status: 'processing',
      rawEmail: emailData,
    };

    const emailLog = await this.emailRepository.createEmailLog(logData);

    try {
      // Find email configuration by inbound email
      const emailConfig = await this.emailRepository.getEmailConfigByInboundEmail(emailData.to);
      
      if (!emailConfig) {
        await this.emailRepository.updateEmailLogStatus(
          emailLog.id, 
          'ignored', 
          'Nenhuma configuração de e-mail encontrada para este endereço'
        );
        return {
          success: false,
          error: 'Email configuration not found',
          logId: emailLog.id,
        };
      }

      // Verify webhook secret if provided
      if (webhookSecret && emailConfig.webhookSecret !== webhookSecret) {
        await this.emailRepository.updateEmailLogStatus(
          emailLog.id, 
          'failed', 
          'Webhook secret inválido'
        );
        return {
          success: false,
          error: 'Invalid webhook secret',
          logId: emailLog.id,
        };
      }

      // Check if email config is active
      if (!emailConfig.isActive) {
        await this.emailRepository.updateEmailLogStatus(
          emailLog.id, 
          'ignored', 
          'Configuração de e-mail desactivada'
        );
        return {
          success: false,
          error: 'Email configuration is inactive',
          logId: emailLog.id,
        };
      }

      // Update log with tenant and config info
      await this.emailRepository.updateEmailLogStatus(emailLog.id, 'processing');
      
      // Find or create customer
      const customer = await this.findOrCreateCustomer(emailData.from, emailConfig.tenantId);
      
      if (!customer) {
        await this.emailRepository.updateEmailLogStatus(
          emailLog.id, 
          'failed', 
          'Falha ao criar ou encontrar cliente'
        );
        return {
          success: false,
          error: 'Failed to find or create customer',
          logId: emailLog.id,
        };
      }

      // Create ticket from email
      const ticket = await this.createTicketFromEmail(emailData, emailConfig, customer.id);
      
      if (!ticket) {
        await this.emailRepository.updateEmailLogStatus(
          emailLog.id, 
          'failed', 
          'Falha ao criar ticket'
        );
        return {
          success: false,
          error: 'Failed to create ticket',
          logId: emailLog.id,
        };
      }

      // Update log with success
      await this.emailRepository.updateEmailLogStatus(emailLog.id, 'processed');
      
      return {
        success: true,
        ticketId: ticket.id,
        logId: emailLog.id,
      };

    } catch (error) {
      console.error('Error processing inbound email:', error);
      
      await this.emailRepository.updateEmailLogStatus(
        emailLog.id, 
        'failed', 
        error instanceof Error ? error.message : 'Erro desconhecido'
      );
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        logId: emailLog.id,
      };
    }
  }

  // Helper Methods
  private generateWebhookSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async findOrCreateCustomer(email: string, tenantId: string) {
    try {
      // Try to find existing customer by email
      const existingCustomer = await this.customersService.getCustomerByEmail(email, tenantId);
      
      if (existingCustomer) {
        return existingCustomer;
      }

      // Extract name from email (fallback)
      const emailParts = email.split('@');
      const name = emailParts[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Create new customer
      const newCustomer = await this.customersService.createCustomer({
        name,
        email,
        tenantId,
      });

      return newCustomer;
    } catch (error) {
      console.error('Error finding or creating customer:', error);
      return null;
    }
  }

  private async createTicketFromEmail(emailData: InboundEmailData, emailConfig: EmailConfig, customerId: string) {
    try {
      const ticketData = {
        title: emailData.subject || 'Ticket criado via e-mail',
        description: this.extractTextFromEmail(emailData),
        customerId,
        tenantId: emailConfig.tenantId,
        departmentId: emailConfig.defaultDepartmentId,
        categoryId: emailConfig.defaultCategoryId,
        priority: emailConfig.defaultPriority || 'medium',
        assigneeId: emailConfig.autoAssignToAgent ? emailConfig.defaultAssigneeId : undefined,
      };

      const ticket = await this.ticketsService.createTicket(ticketData);
      
      // TODO: Handle attachments if present
      if (emailData.attachments && emailData.attachments.length > 0) {
        // Process attachments - this would need to be implemented
        console.log(`Ticket ${ticket.id} has ${emailData.attachments.length} attachments to process`);
      }

      return ticket;
    } catch (error) {
      console.error('Error creating ticket from email:', error);
      return null;
    }
  }

  private extractTextFromEmail(emailData: InboundEmailData): string {
    // Prefer plain text, fallback to HTML stripped of tags
    if (emailData.text) {
      return emailData.text;
    }
    
    if (emailData.html) {
      // Simple HTML tag removal - in production, use a proper HTML parser
      return emailData.html.replace(/<[^>]*>/g, '').trim();
    }
    
    return 'Conteúdo do e-mail não disponível';
  }

  // Email Logs
  async getEmailLogs(tenantId: string, limit: number = 50) {
    return await this.emailRepository.getEmailLogsByTenant(tenantId, limit);
  }

  async getEmailLogsByStatus(status: string, limit: number = 50) {
    return await this.emailRepository.getEmailLogsByStatus(status, limit);
  }
}