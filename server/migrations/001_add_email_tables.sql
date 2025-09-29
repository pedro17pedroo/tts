-- Migração para adicionar tabelas de processamento de e-mail
-- Data: 2024-01-XX
-- Descrição: Adiciona tabelas emailConfigs e emailLogs para suporte ao processamento de e-mails

-- Tabela de configurações de e-mail por tenant
CREATE TABLE IF NOT EXISTS "emailConfigs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "inboundEmail" varchar(255) NOT NULL,
  "webhookSecret" varchar(255) NOT NULL,
  "isActive" boolean DEFAULT true,
  "defaultDepartmentId" uuid REFERENCES "departments"("id") ON DELETE SET NULL,
  "defaultCategoryId" uuid REFERENCES "categories"("id") ON DELETE SET NULL,
  "defaultPriority" varchar(20) DEFAULT 'medium',
  "autoAssignToAgent" boolean DEFAULT false,
  "defaultAssigneeId" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now(),
  UNIQUE("tenantId") -- Um tenant pode ter apenas uma configuração de e-mail
);

-- Tabela de logs de processamento de e-mail
CREATE TABLE IF NOT EXISTS "emailLogs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "fromEmail" varchar(255) NOT NULL,
  "toEmail" varchar(255) NOT NULL,
  "subject" text,
  "messageId" varchar(255),
  "status" varchar(20) NOT NULL DEFAULT 'received', -- received, processed, failed, ignored
  "ticketId" uuid REFERENCES "tickets"("id") ON DELETE SET NULL,
  "customerId" uuid REFERENCES "customers"("id") ON DELETE SET NULL,
  "errorMessage" text,
  "processedAt" timestamp DEFAULT now(),
  "createdAt" timestamp DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS "idx_emailConfigs_tenantId" ON "emailConfigs"("tenantId");
CREATE INDEX IF NOT EXISTS "idx_emailConfigs_inboundEmail" ON "emailConfigs"("inboundEmail");
CREATE INDEX IF NOT EXISTS "idx_emailConfigs_isActive" ON "emailConfigs"("isActive");

CREATE INDEX IF NOT EXISTS "idx_emailLogs_tenantId" ON "emailLogs"("tenantId");
CREATE INDEX IF NOT EXISTS "idx_emailLogs_status" ON "emailLogs"("status");
CREATE INDEX IF NOT EXISTS "idx_emailLogs_fromEmail" ON "emailLogs"("fromEmail");
CREATE INDEX IF NOT EXISTS "idx_emailLogs_ticketId" ON "emailLogs"("ticketId");
CREATE INDEX IF NOT EXISTS "idx_emailLogs_processedAt" ON "emailLogs"("processedAt");

-- Comentários para documentação
COMMENT ON TABLE "emailConfigs" IS 'Configurações de processamento de e-mail por tenant';
COMMENT ON TABLE "emailLogs" IS 'Logs de processamento de e-mails recebidos';

COMMENT ON COLUMN "emailConfigs"."inboundEmail" IS 'E-mail configurado para receber tickets';
COMMENT ON COLUMN "emailConfigs"."webhookSecret" IS 'Chave secreta para validar webhooks';
COMMENT ON COLUMN "emailConfigs"."defaultPriority" IS 'Prioridade padrão para tickets criados via e-mail';
COMMENT ON COLUMN "emailConfigs"."autoAssignToAgent" IS 'Se deve atribuir automaticamente a um agente';

COMMENT ON COLUMN "emailLogs"."status" IS 'Status do processamento: received, processed, failed, ignored';
COMMENT ON COLUMN "emailLogs"."messageId" IS 'ID único da mensagem de e-mail';
COMMENT ON COLUMN "emailLogs"."errorMessage" IS 'Mensagem de erro se o processamento falhou';