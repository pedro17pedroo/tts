import { Router, Request, Response } from "express";
import EmailTicketProcessor from "./email-processor";

const router = Router();
const emailProcessor = new EmailTicketProcessor();

/**
 * Webhook para receber emails do SendGrid Inbound Parse
 * Documentação: https://docs.sendgrid.com/for-developers/parsing-email/inbound-email
 */
router.post('/inbound', async (req: Request, res: Response) => {
  try {
    console.log('Email recebido via webhook:', req.body);

    // Extrair tenant do email de destino
    const tenantId = extractTenantFromEmail(req.body.to);

    // Validar se conseguimos identificar o tenant
    if (!tenantId) {
      console.error('Não foi possível identificar o tenant do email:', req.body.to);
      return res.status(400).json({ 
        error: 'Tenant não identificado',
        message: 'Não foi possível identificar a empresa de destino do email'
      });
    }

    // Extrair dados do email do SendGrid
    const emailData = {
      from: req.body.from,
      subject: req.body.subject || 'Sem assunto',
      body: req.body.text || req.body.html || '',
      attachments: parseAttachments(req.body),
      receivedAt: new Date(),
      tenantId: tenantId, // Agora garantimos que não é null
    };

    // Processar email para ticket
    const result = await emailProcessor.processEmailToTicket(emailData);

    if (result.success) {
      console.log(`Ticket ${result.ticketId} criado com sucesso para cliente ${result.customerId}`);
      return res.status(200).json({
        success: true,
        ticketId: result.ticketId,
        customerId: result.customerId,
        message: 'Email processado e ticket criado com sucesso'
      });
    } else {
      console.error('Erro ao processar email:', result.error);
      return res.status(500).json({
        success: false,
        error: result.error,
        message: 'Erro ao processar email'
      });
    }

  } catch (error) {
    console.error('Erro no webhook de email:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * Webhook de teste para simular recebimento de email
 */
router.post('/test', async (req: Request, res: Response) => {
  try {
    const testEmailData = {
      from: req.body.from || 'teste@exemplo.com',
      subject: req.body.subject || 'Email de teste',
      body: req.body.body || 'Este é um email de teste para criação de ticket.',
      attachments: req.body.attachments || [],
      receivedAt: new Date(),
      tenantId: req.body.tenantId || 'test-tenant-id',
    };

    const result = await emailProcessor.processEmailToTicket(testEmailData);

    res.status(200).json({
      success: result.success,
      ticketId: result.ticketId,
      customerId: result.customerId,
      error: result.error,
      message: result.success ? 'Ticket de teste criado com sucesso' : 'Erro ao criar ticket de teste'
    });

  } catch (error) {
    console.error('Erro no teste de email:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Extrai anexos do payload do SendGrid
 */
function parseAttachments(body: any): Array<{ filename: string; content: string; contentType: string }> {
  const attachments: Array<{ filename: string; content: string; contentType: string }> = [];
  
  // SendGrid envia anexos como attachment1, attachment2, etc.
  let attachmentIndex = 1;
  while (body[`attachment${attachmentIndex}`]) {
    const attachment = body[`attachment${attachmentIndex}`];
    const attachmentInfo = body[`attachment${attachmentIndex}_info`];
    
    if (attachment && attachmentInfo) {
      try {
        const info = JSON.parse(attachmentInfo);
        attachments.push({
          filename: info.filename || `attachment${attachmentIndex}`,
          content: attachment, // SendGrid já envia em base64
          contentType: info.type || 'application/octet-stream'
        });
      } catch (error) {
        console.error(`Erro ao processar anexo ${attachmentIndex}:`, error);
      }
    }
    
    attachmentIndex++;
  }
  
  return attachments;
}

/**
 * Extrai o tenant ID baseado no email de destino
 * Formato esperado: suporte@{tenant-domain}.tatuticket.com
 * ou configuração personalizada por tenant
 */
function extractTenantFromEmail(toEmail: string): string | null {
  if (!toEmail) return null;

  // Implementar lógica para mapear email de destino para tenant
  // Por enquanto, implementação simples baseada no domínio
  
  // Exemplo: suporte@empresa1.tatuticket.com -> empresa1
  const match = toEmail.match(/^[^@]+@([^.]+)\.tatuticket\.com$/);
  if (match) {
    return match[1]; // Retorna o subdomínio como tenant ID
  }

  // Exemplo: suporte@empresaexemplo.com -> buscar tenant por domínio personalizado
  // TODO: Implementar busca no banco de dados por domínio personalizado
  
  // Por enquanto, retornar null se não conseguir identificar
  console.warn('Não foi possível extrair tenant do email:', toEmail);
  return null;
}

/**
 * Endpoint para configurar domínios de email por tenant
 */
router.post('/configure-domain', async (req: Request, res: Response) => {
  try {
    const { tenantId, emailDomain, emailPrefix } = req.body;
    
    // TODO: Salvar configuração de domínio de email no banco de dados
    // Exemplo: tenant "empresa1" pode receber emails em "suporte@empresa1.com"
    
    console.log(`Configurando domínio de email para tenant ${tenantId}: ${emailPrefix}@${emailDomain}`);
    
    res.status(200).json({
      success: true,
      message: 'Domínio de email configurado com sucesso',
      configuration: {
        tenantId,
        emailDomain,
        emailPrefix,
        fullEmail: `${emailPrefix}@${emailDomain}`
      }
    });
    
  } catch (error) {
    console.error('Erro ao configurar domínio de email:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

export { router as emailWebhookRouter };