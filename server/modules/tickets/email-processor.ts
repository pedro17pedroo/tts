import { sendEmail } from "../../emailService";
import { TicketsService } from "./service";
import { CustomersService } from "../customers/service";
import type { InsertTicket, InsertCustomer } from "../../schema";

interface EmailTicket {
  from: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded content
    contentType: string;
  }>;
  receivedAt: Date;
  tenantId: string;
}

interface ProcessedEmail {
  ticketId: string;
  customerId: string;
  success: boolean;
  error?: string;
}

export class EmailTicketProcessor {
  private ticketsService: TicketsService;
  private customersService: CustomersService;

  constructor() {
    this.ticketsService = new TicketsService();
    this.customersService = new CustomersService();
  }

  /**
   * Processa um email recebido e converte em ticket
   */
  async processEmailToTicket(emailData: EmailTicket): Promise<ProcessedEmail> {
    try {
      // 1. Encontrar ou criar cliente baseado no email
      const customer = await this.findOrCreateCustomer(emailData.from, emailData.tenantId);
      
      // 2. Criar ticket baseado no email
      const ticketData: InsertTicket = {
        title: this.cleanSubject(emailData.subject),
        description: this.formatEmailBody(emailData),
        status: 'new',
        priority: this.determinePriority(emailData.subject),
        tenantId: emailData.tenantId,
        customerId: customer.id,
        // Definir departamento padrão ou baseado em regras
        departmentId: await this.determineDepartment(emailData.tenantId, emailData.subject),
        categoryId: await this.determineCategory(emailData.tenantId, emailData.subject),
      };

      const ticket = await this.ticketsService.createTicket(ticketData);

      // 3. Processar anexos se existirem
      if (emailData.attachments && emailData.attachments.length > 0) {
        await this.processEmailAttachments(ticket.id, emailData.attachments);
      }

      // 4. Enviar confirmação para o cliente
      await this.sendTicketConfirmation(customer.email, ticket.id, ticket.title);

      return {
        ticketId: ticket.id,
        customerId: customer.id,
        success: true,
      };

    } catch (error) {
      console.error('Erro ao processar email para ticket:', error);
      return {
        ticketId: '',
        customerId: '',
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Encontra cliente existente ou cria novo baseado no email
   */
  private async findOrCreateCustomer(email: string, tenantId: string) {
    // Tentar encontrar cliente existente por email
    const existingCustomers = await this.customersService.getCustomersByTenant(tenantId);
    const existingCustomer = existingCustomers.find(customer => customer.email === email);
    
    if (existingCustomer) {
      return existingCustomer;
    }

    // Criar novo cliente
    const customerData: InsertCustomer = {
      name: this.extractNameFromEmail(email),
      email: email,
      tenantId: tenantId,
    };

    return await this.customersService.createCustomer(customerData);
  }

  /**
   * Limpa o assunto do email removendo prefixos comuns
   */
  private cleanSubject(subject: string): string {
    // Remover prefixos como "Re:", "Fwd:", etc.
    return subject
      .replace(/^(Re|RE|Fwd|FWD|Fw|FW):\s*/gi, '')
      .replace(/^\[.*?\]\s*/, '') // Remove [tags] no início
      .trim();
  }

  /**
   * Formata o corpo do email para o ticket
   */
  private formatEmailBody(emailData: EmailTicket): string {
    const timestamp = emailData.receivedAt.toLocaleString('pt-AO');
    
    return `**Email recebido em:** ${timestamp}
**De:** ${emailData.from}
**Assunto:** ${emailData.subject}

---

${emailData.body}`;
  }

  /**
   * Determina a prioridade baseada no assunto do email
   */
  private determinePriority(subject: string): 'low' | 'medium' | 'high' | 'critical' {
    const urgentKeywords = ['urgente', 'crítico', 'emergência', 'urgent', 'critical', 'emergency'];
    const highKeywords = ['importante', 'prioritário', 'important', 'priority'];
    
    const lowerSubject = subject.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerSubject.includes(keyword))) {
      return 'critical';
    }
    
    if (highKeywords.some(keyword => lowerSubject.includes(keyword))) {
      return 'high';
    }
    
    return 'medium';
  }

  /**
   * Determina o departamento baseado no assunto ou regras do tenant
   */
  private async determineDepartment(tenantId: string, subject: string): Promise<string | undefined> {
    // Implementar lógica para determinar departamento
    // Por enquanto, retorna undefined (departamento padrão)
    return undefined;
  }

  /**
   * Determina a categoria baseada no assunto ou regras do tenant
   */
  private async determineCategory(tenantId: string, subject: string): Promise<string | undefined> {
    // Implementar lógica para determinar categoria
    // Por enquanto, retorna undefined (categoria padrão)
    return undefined;
  }

  /**
   * Processa anexos do email
   */
  private async processEmailAttachments(
    ticketId: string, 
    attachments: Array<{ filename: string; content: string; contentType: string }>
  ): Promise<void> {
    // Implementar processamento de anexos
    // Por enquanto, apenas log
    console.log(`Processando ${attachments.length} anexos para ticket ${ticketId}`);
    
    // TODO: Salvar anexos no sistema de storage
    // TODO: Criar registros na tabela ticket_attachments
  }

  /**
   * Envia confirmação de criação do ticket para o cliente
   */
  private async sendTicketConfirmation(customerEmail: string, ticketId: string, ticketTitle: string): Promise<void> {
    const subject = `Ticket #${ticketId} criado - ${ticketTitle}`;
    const html = `
      <h2>Ticket criado com sucesso</h2>
      <p>Olá,</p>
      <p>O seu ticket foi criado com sucesso:</p>
      <ul>
        <li><strong>Número:</strong> #${ticketId}</li>
        <li><strong>Título:</strong> ${ticketTitle}</li>
        <li><strong>Status:</strong> Novo</li>
      </ul>
      <p>Iremos responder o mais breve possível.</p>
      <p>Obrigado,<br>Equipa de Suporte</p>
    `;

    await sendEmail({
      to: customerEmail,
      subject,
      html,
    });
  }

  /**
   * Extrai nome do email (parte antes do @)
   */
  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];
    // Capitalizar primeira letra e substituir pontos/underscores por espaços
    return localPart
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Configura webhook para receber emails (exemplo para SendGrid)
   */
  static setupEmailWebhook() {
    // Esta função seria chamada na configuração do servidor
    // para configurar o webhook que recebe emails
    console.log('Email webhook configurado para processar emails recebidos');
  }
}

export default EmailTicketProcessor;