# Sistema de Processamento de E-mail

Este módulo implementa o processamento automático de e-mails para criação de tickets no TatuTicket.

## Funcionalidades

### 1. Configuração de E-mail por Tenant
- Cada tenant pode configurar um e-mail para receber tickets
- Configurações incluem departamento, categoria e prioridade padrão
- Opção de atribuição automática a agentes
- Webhook secret para validação de segurança

### 2. Processamento de E-mails Recebidos
- Webhook endpoint para receber e-mails de provedores externos
- Validação de configuração e webhook secret
- Criação automática de clientes se não existirem
- Criação de tickets com base no conteúdo do e-mail
- Log completo de todas as operações

### 3. Gestão de Logs
- Registro de todos os e-mails processados
- Status de processamento (received, processed, failed, ignored)
- Rastreamento de erros e problemas
- Histórico completo para auditoria

## Estrutura do Módulo

```
modules/email/
├── controller.ts    # Controlador HTTP
├── service.ts       # Lógica de negócio
├── repository.ts    # Acesso aos dados
├── routes.ts        # Definição de rotas
└── README.md        # Esta documentação
```

## API Endpoints

### Configuração de E-mail

#### POST /api/email/config
Cria uma nova configuração de e-mail para o tenant.

**Body:**
```json
{
  "inboundEmail": "suporte@empresa.com",
  "isActive": true,
  "defaultDepartmentId": "uuid",
  "defaultCategoryId": "uuid", 
  "defaultPriority": "medium",
  "autoAssignToAgent": false,
  "defaultAssigneeId": "uuid"
}
```

#### GET /api/email/config
Obtém a configuração de e-mail do tenant.

#### PUT /api/email/config
Actualiza a configuração de e-mail do tenant.

#### DELETE /api/email/config
Remove a configuração de e-mail do tenant.

### Processamento de E-mail

#### POST /api/email/webhook/inbound
Endpoint webhook para processar e-mails recebidos (sem autenticação).

**Headers:**
- `x-webhook-secret`: Chave secreta para validação

**Body:**
```json
{
  "from": "cliente@email.com",
  "to": "suporte@empresa.com", 
  "subject": "Problema com o sistema",
  "text": "Descrição do problema...",
  "html": "<p>Descrição do problema...</p>",
  "messageId": "unique-message-id",
  "attachments": [
    {
      "filename": "screenshot.png",
      "content": "base64-encoded-content",
      "contentType": "image/png",
      "size": 12345
    }
  ]
}
```

### Logs de E-mail

#### GET /api/email/logs
Lista os logs de e-mail do tenant.

**Query Parameters:**
- `limit`: Número máximo de logs (padrão: 50)

#### GET /api/email/logs/status/:status
Lista logs por status específico.

**Status disponíveis:**
- `received`: E-mail recebido
- `processed`: E-mail processado com sucesso
- `failed`: Falha no processamento
- `ignored`: E-mail ignorado

## Configuração de Webhook

Para integrar com provedores de e-mail externos (como SendGrid, Mailgun, etc.), configure o webhook para apontar para:

```
POST https://seu-dominio.com/api/email/webhook/inbound
```

### Headers obrigatórios:
- `x-webhook-secret`: A chave secreta gerada na configuração
- `Content-Type`: application/json

## Fluxo de Processamento

1. **Recepção**: E-mail chega ao webhook endpoint
2. **Validação**: Verifica webhook secret e configuração do tenant
3. **Cliente**: Busca ou cria cliente baseado no e-mail remetente
4. **Ticket**: Cria novo ticket com dados do e-mail
5. **Anexos**: Processa anexos se presentes
6. **Log**: Registra resultado da operação
7. **Notificação**: Envia notificação de novo ticket (se configurado)

## Segurança

- Webhook secret único por tenant
- Validação de configuração activa
- Logs de auditoria completos
- Sanitização de conteúdo HTML
- Validação de tamanho de anexos

## Tratamento de Erros

O sistema trata os seguintes cenários de erro:

- **Configuração inválida**: E-mail ignorado, log com status 'ignored'
- **Webhook secret inválido**: Retorna 401 Unauthorized
- **Falha na criação de cliente**: Log com status 'failed'
- **Falha na criação de ticket**: Log com status 'failed'
- **Anexos muito grandes**: Processamento continua sem anexos

## Monitorização

Use os logs de e-mail para monitorizar:

- Volume de e-mails recebidos
- Taxa de sucesso no processamento
- Erros frequentes
- Performance do sistema

## Configuração de Desenvolvimento

Para testar localmente, use ferramentas como ngrok para expor o webhook:

```bash
ngrok http 3000
# Configure webhook URL: https://abc123.ngrok.io/api/email/webhook/inbound
```

## Limitações Actuais

- Suporte apenas para texto simples e HTML
- Anexos limitados por configuração do servidor
- Um e-mail de configuração por tenant
- Processamento síncrono (pode ser melhorado com filas)

## Melhorias Futuras

- [ ] Processamento assíncrono com filas
- [ ] Suporte a múltiplos e-mails por tenant
- [ ] Regras avançadas de roteamento
- [ ] Integração com anti-spam
- [ ] Análise de sentimento automática
- [ ] Templates de resposta automática