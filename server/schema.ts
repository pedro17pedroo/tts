import { sql, relations } from 'drizzle-orm';
import {
  index,
  uniqueIndex,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const planTypeEnum = pgEnum('plan_type', ['free', 'pro', 'enterprise']);
export const ticketStatusEnum = pgEnum('ticket_status', ['new', 'in_progress', 'waiting_customer', 'resolved', 'closed']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high', 'critical']);
export const userRoleEnum = pgEnum('user_role', ['global_admin', 'tenant_admin', 'agent', 'customer']);
export const slaStatusEnum = pgEnum('sla_status_enum', ['compliant', 'at_risk', 'breached']);
export const slaLogActionEnum = pgEnum('sla_log_action_enum', ['created', 'updated', 'deleted', 'violation', 'resolution']);

// Tenants (companies using the SaaS)
export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  nif: varchar("nif", { length: 20 }), // Angola tax ID (replaced cnpj)
  domain: varchar("domain", { length: 255 }),
  planType: planTypeEnum("plan_type").notNull().default('free'),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default('active'),
  maxUsers: integer("max_users").default(3),
  maxTickets: integer("max_tickets").default(100),
  maxStorage: integer("max_storage").default(1), // GB
  customBranding: jsonb("custom_branding"),
  // Internationalization fields for Angola
  locale: varchar("locale", { length: 10 }).default('pt-AO'), // Angola Portuguese
  currency: varchar("currency", { length: 3 }).default('AOA'), // Angolan Kwanza
  timezone: varchar("timezone", { length: 50 }).default('Africa/Luanda'),
  dateFormat: varchar("date_format", { length: 20 }).default('DD/MM/YYYY'),
  timeFormat: varchar("time_format", { length: 10 }).default('24h'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users (admins, agents, customers)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),
  resetToken: varchar("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  emailVerified: boolean("email_verified").default(false),
  emailVerifyToken: varchar("email_verify_token"),
  role: userRoleEnum("role").notNull().default('customer'),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: 'cascade' }),
  isActive: boolean("is_active").default(true),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Departments within tenants
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ticket categories
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default('#3b82f6'),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers of tenants
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  company: varchar("company"),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hour banks for customers
export const hourBanks = pgTable("hour_banks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id, { onDelete: 'cascade' }),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  totalHours: decimal("total_hours", { precision: 8, scale: 2 }).notNull(),
  consumedHours: decimal("consumed_hours", { precision: 8, scale: 2 }).default('0'),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tickets
export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status").notNull().default('new'),
  priority: ticketPriorityEnum("priority").notNull().default('medium'),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  assigneeId: varchar("assignee_id").references(() => users.id),
  departmentId: varchar("department_id").references(() => departments.id),
  categoryId: varchar("category_id").references(() => categories.id),
  timeSpent: decimal("time_spent", { precision: 8, scale: 2 }).default('0'),
  slaFirstResponseAt: timestamp("sla_first_response_at"),
  slaResolutionAt: timestamp("sla_resolution_at"),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ticket comments/responses
export const ticketComments = pgTable("ticket_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  authorId: varchar("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ticket attachments
export const ticketAttachments = pgTable("ticket_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  uploadedById: varchar("uploaded_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Time tracking entries
export const timeEntries = pgTable("time_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: decimal("duration", { precision: 8, scale: 2 }),
  description: text("description"),
  hourBankId: varchar("hour_bank_id").references(() => hourBanks.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Knowledge base articles
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  isPublic: boolean("is_public").default(false),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  authorId: varchar("author_id").notNull().references(() => users.id),
  categoryId: varchar("category_id").references(() => categories.id),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SLA configurations - Configurações de SLA por tenant, categoria e prioridade
export const slaConfigs = pgTable("sla_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  categoryId: varchar("category_id").references(() => categories.id), // null = applies to all categories
  priority: ticketPriorityEnum("priority").notNull(),
  firstResponseMinutes: integer("first_response_minutes").notNull(),
  resolutionMinutes: integer("resolution_minutes").notNull(),
  // Business hours configuration
  businessHoursStart: varchar("business_hours_start", { length: 5 }).default('09:00'), // HH:MM format
  businessHoursEnd: varchar("business_hours_end", { length: 5 }).default('18:00'), // HH:MM format
  businessDays: jsonb("business_days").default('[1,2,3,4,5]'), // Array of weekdays (1=Monday, 7=Sunday)
  timezone: varchar("timezone", { length: 50 }).default('Africa/Luanda'),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_sla_configs_tenant_priority").on(table.tenantId, table.priority),
  index("idx_sla_configs_category").on(table.categoryId),
  uniqueIndex("idx_sla_configs_null_category").on(table.tenantId, table.priority).where(sql`${table.categoryId} IS NULL`),
  uniqueIndex("idx_sla_configs_with_category").on(table.tenantId, table.categoryId, table.priority).where(sql`${table.categoryId} IS NOT NULL`),
]);

// SLA status tracking per ticket - Status de SLA por ticket
export const slaStatus = pgTable("sla_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().unique().references(() => tickets.id, { onDelete: 'cascade' }),
  slaConfigId: varchar("sla_config_id").references(() => slaConfigs.id),
  // SLA timestamps
  firstResponseDueAt: timestamp("first_response_due_at"),
  resolutionDueAt: timestamp("resolution_due_at"),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  // Status tracking
  firstResponseStatus: slaStatusEnum("first_response_status").default('compliant'),
  resolutionStatus: slaStatusEnum("resolution_status").default('compliant'),
  // Time calculations (in minutes)
  firstResponseTimeRemaining: integer("first_response_time_remaining"),
  resolutionTimeRemaining: integer("resolution_time_remaining"),
  firstResponseTimeSpent: integer("first_response_time_spent"),
  resolutionTimeSpent: integer("resolution_time_spent"),
  // Breach tracking
  firstResponseBreachedAt: timestamp("first_response_breached_at"),
  resolutionBreachedAt: timestamp("resolution_breached_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_sla_status_due_dates").on(table.firstResponseDueAt, table.resolutionDueAt),
  index("idx_sla_status_breached").on(table.firstResponseBreachedAt, table.resolutionBreachedAt),
]);

// SLA logs and audit trail - Histórico e auditoria de SLAs
export const slaLogs = pgTable("sla_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  ticketId: varchar("ticket_id").references(() => tickets.id, { onDelete: 'cascade' }),
  slaConfigId: varchar("sla_config_id").references(() => slaConfigs.id),
  slaStatusId: varchar("sla_status_id").references(() => slaStatus.id),
  action: slaLogActionEnum("action").notNull(),
  // Event details
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'first_response_breach', 'resolution_breach', 'config_change', etc.
  description: text("description"),
  oldValues: jsonb("old_values"), // For configuration changes
  newValues: jsonb("new_values"), // For configuration changes
  // Metrics
  responseTime: integer("response_time"), // Minutes taken for first response
  resolutionTime: integer("resolution_time"), // Minutes taken for resolution
  // Context
  userId: varchar("user_id").references(() => users.id), // User who triggered the action
  metadata: jsonb("metadata"), // Additional context data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_sla_logs_tenant_date").on(table.tenantId, table.createdAt),
  index("idx_sla_logs_ticket").on(table.ticketId),
  index("idx_sla_logs_action").on(table.action),
  index("idx_sla_logs_event_type").on(table.eventType),
]);

// Email configurations for tenants
export const emailConfigs = pgTable("email_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  inboundEmail: varchar("inbound_email", { length: 255 }).notNull(), // support@tenant.com
  webhookSecret: varchar("webhook_secret", { length: 255 }).notNull(),
  defaultDepartmentId: varchar("default_department_id").references(() => departments.id),
  defaultCategoryId: varchar("default_category_id").references(() => categories.id),
  defaultPriority: ticketPriorityEnum("default_priority").default('medium'),
  autoAssignToAgent: boolean("auto_assign_to_agent").default(false),
  defaultAssigneeId: varchar("default_assignee_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("idx_email_configs_tenant").on(table.tenantId),
  uniqueIndex("idx_email_configs_inbound").on(table.inboundEmail),
]);

// Email processing logs
export const emailLogs = pgTable("email_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: 'cascade' }),
  emailConfigId: varchar("email_config_id").references(() => emailConfigs.id),
  ticketId: varchar("ticket_id").references(() => tickets.id),
  fromEmail: varchar("from_email", { length: 255 }).notNull(),
  toEmail: varchar("to_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }),
  messageId: varchar("message_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(), // 'processed', 'failed', 'ignored'
  errorMessage: text("error_message"),
  rawEmail: jsonb("raw_email"), // Store the full email data
  processedAt: timestamp("processed_at").defaultNow(),
}, (table) => [
  index("idx_email_logs_tenant_date").on(table.tenantId, table.processedAt),
  index("idx_email_logs_status").on(table.status),
  index("idx_email_logs_message_id").on(table.messageId),
]);

// Relations
export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  users: many(users),
  departments: many(departments),
  categories: many(categories),
  customers: many(customers),
  tickets: many(tickets),
  hourBanks: many(hourBanks),
  articles: many(articles),
  slaConfigs: many(slaConfigs),
  slaLogs: many(slaLogs),
  emailConfig: one(emailConfigs, {
    fields: [tenants.id],
    references: [emailConfigs.tenantId],
  }),
  emailLogs: many(emailLogs),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  assignedTickets: many(tickets),
  timeEntries: many(timeEntries),
  ticketComments: many(ticketComments),
  articles: many(articles),
  slaLogs: many(slaLogs),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [customers.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  tickets: many(tickets),
  hourBanks: many(hourBanks),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [tickets.tenantId],
    references: [tenants.id],
  }),
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
  assignee: one(users, {
    fields: [tickets.assigneeId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [tickets.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [tickets.categoryId],
    references: [categories.id],
  }),
  comments: many(ticketComments),
  attachments: many(ticketAttachments),
  timeEntries: many(timeEntries),
  slaStatus: one(slaStatus, {
    fields: [tickets.id],
    references: [slaStatus.ticketId],
  }),
  slaLogs: many(slaLogs),
}));

export const hourBanksRelations = relations(hourBanks, ({ one, many }) => ({
  customer: one(customers, {
    fields: [hourBanks.customerId],
    references: [customers.id],
  }),
  tenant: one(tenants, {
    fields: [hourBanks.tenantId],
    references: [tenants.id],
  }),
  timeEntries: many(timeEntries),
}));

// Categories relations - Relações de categorias  
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [categories.tenantId],
    references: [tenants.id],
  }),
  tickets: many(tickets),
  articles: many(articles),
  slaConfigs: many(slaConfigs),
}));

// SLA Config relations - Relações de configurações SLA
export const slaConfigsRelations = relations(slaConfigs, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [slaConfigs.tenantId],
    references: [tenants.id],
  }),
  category: one(categories, {
    fields: [slaConfigs.categoryId],
    references: [categories.id],
  }),
  slaStatuses: many(slaStatus),
  slaLogs: many(slaLogs),
}));

// SLA Status relations - Relações de status SLA
export const slaStatusRelations = relations(slaStatus, ({ one, many }) => ({
  ticket: one(tickets, {
    fields: [slaStatus.ticketId],
    references: [tickets.id],
  }),
  slaConfig: one(slaConfigs, {
    fields: [slaStatus.slaConfigId],
    references: [slaConfigs.id],
  }),
  slaLogs: many(slaLogs),
}));

// SLA Logs relations - Relações de logs SLA
export const slaLogsRelations = relations(slaLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [slaLogs.tenantId],
    references: [tenants.id],
  }),
  ticket: one(tickets, {
    fields: [slaLogs.ticketId],
    references: [tickets.id],
  }),
  slaConfig: one(slaConfigs, {
    fields: [slaLogs.slaConfigId],
    references: [slaConfigs.id],
  }),
  slaStatus: one(slaStatus, {
    fields: [slaLogs.slaStatusId],
    references: [slaStatus.id],
  }),
  user: one(users, {
    fields: [slaLogs.userId],
    references: [users.id],
  }),
}));

export const emailConfigsRelations = relations(emailConfigs, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [emailConfigs.tenantId],
    references: [tenants.id],
  }),
  defaultDepartment: one(departments, {
    fields: [emailConfigs.defaultDepartmentId],
    references: [departments.id],
  }),
  defaultCategory: one(categories, {
    fields: [emailConfigs.defaultCategoryId],
    references: [categories.id],
  }),
  defaultAssignee: one(users, {
    fields: [emailConfigs.defaultAssigneeId],
    references: [users.id],
  }),
  emailLogs: many(emailLogs),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [emailLogs.tenantId],
    references: [tenants.id],
  }),
  emailConfig: one(emailConfigs, {
    fields: [emailLogs.emailConfigId],
    references: [emailConfigs.id],
  }),
  ticket: one(tickets, {
    fields: [emailLogs.ticketId],
    references: [tickets.id],
  }),
}));

// Custom branding schema
export const customBrandingSchema = z.object({
  logo: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  companyName: z.string().optional(),
  favicon: z.string().optional(),
  customCss: z.string().optional(),
  // Locale support for translation
  locale: z.string().default('pt-AO'), // Angola Portuguese
  translations: z.record(z.string()).optional(), // Key-value pairs for translations
  timezone: z.string().default('Africa/Luanda'), // Updated default for Angola
  dateFormat: z.string().default('DD/MM/YYYY'),
  timeFormat: z.string().default('24h'),
});

// Custom fields schema for tickets
export const customFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['text', 'textarea', 'select', 'checkbox', 'number', 'date']),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // for select fields
  defaultValue: z.string().optional(),
});

// Update tenant branding schema
export const updateTenantBrandingSchema = z.object({
  customBranding: customBrandingSchema.optional(),
});

// Insert schemas
// Using Drizzle inferred types instead of Zod schemas to avoid version conflicts

// Helper function to create localized validation messages
const createValidationMessages = () => ({
  email: "Introduza um e-mail válido",
  required: "Este campo é obrigatório",
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  passwordWeak: "Palavra-passe muito fraca",
  passwordMismatch: "Palavras-passe não coincidem",
  invalidToken: "Token inválido ou expirado",
  nameRequired: "Nome é obrigatório",
  surnameRequired: "Apelido é obrigatório", 
  passwordRequired: "Palavra-passe é obrigatória",
  currentPasswordRequired: "Palavra-passe actual é obrigatória",
  newPasswordRequired: "Nova palavra-passe é obrigatória"
});

const messages = createValidationMessages();

// Authentication schemas with Portuguese (Angola) validation messages
export const registerUserSchema = z.object({
  email: z.string().email(messages.email),
  password: z.string().min(6, messages.minLength(6)),
  firstName: z.string().min(2, messages.nameRequired),
  lastName: z.string().min(2, messages.surnameRequired),
  tenantId: z.string().optional(),
  role: z.enum(['global_admin', 'tenant_admin', 'agent', 'customer']).default('customer'),
});

export const loginUserSchema = z.object({
  email: z.string().email(messages.email),
  password: z.string().min(1, messages.passwordRequired),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(messages.email),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, messages.invalidToken),
  password: z.string().min(6, messages.minLength(6)),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, messages.currentPasswordRequired),
  newPassword: z.string().min(6, messages.minLength(6)),
});

// Removed createInsertSchema calls to avoid Zod version conflicts
// Using Drizzle inferred types instead

export const insertSlaStatusSchema = z.object({
  ticketId: z.string(),
  slaConfigId: z.string().optional(),
  firstResponseDueAt: z.date().optional(),
  resolutionDueAt: z.date().optional(),
  firstResponseAt: z.date().optional(),
  resolvedAt: z.date().optional(),
  status: z.enum(['compliant', 'at_risk', 'breached']).default('compliant'),
  firstResponseBreachedAt: z.date().optional(),
  resolutionBreachedAt: z.date().optional(),
});

export const insertSlaLogSchema = z.object({
  tenantId: z.string(),
  ticketId: z.string().optional(),
  slaConfigId: z.string().optional(),
  slaStatusId: z.string().optional(),
  userId: z.string().optional(),
  action: z.enum(['created', 'updated', 'deleted', 'violation', 'resolution']),
  description: z.string().optional(),
  previousStatus: z.enum(['compliant', 'at_risk', 'breached']).optional(),
  newStatus: z.enum(['compliant', 'at_risk', 'breached']).optional(),
  eventType: z.string().max(50),
  metadata: z.any().optional(),
});

export const insertEmailConfigSchema = z.object({
  tenantId: z.string(),
  inboundEmail: z.string().max(255),
  webhookSecret: z.string().max(255),
  defaultDepartmentId: z.string().optional(),
  defaultCategoryId: z.string().optional(),
  defaultPriority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  autoAssignToAgent: z.boolean().default(false),
  defaultAssigneeId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertEmailLogSchema = z.object({
  tenantId: z.string().optional(),
  emailConfigId: z.string().optional(),
  ticketId: z.string().optional(),
  fromEmail: z.string().max(255),
  toEmail: z.string().max(255),
  subject: z.string().max(500).optional(),
  messageId: z.string().max(255).optional(),
  status: z.string().max(50),
  errorMessage: z.string().optional(),
  rawEmail: z.any().optional(),
});

// Types - Using Drizzle inferred types to avoid Zod version conflicts
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = typeof tenants.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;
export type TicketComment = typeof ticketComments.$inferSelect;
export type InsertTicketComment = typeof ticketComments.$inferInsert;
export type HourBank = typeof hourBanks.$inferSelect;
export type InsertHourBank = typeof hourBanks.$inferInsert;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = typeof timeEntries.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type SlaConfig = typeof slaConfigs.$inferSelect;
export type InsertSlaConfig = typeof slaConfigs.$inferInsert;
export type SlaStatus = typeof slaStatus.$inferSelect;
export type InsertSlaStatus = typeof slaStatus.$inferInsert;
export type SlaLog = typeof slaLogs.$inferSelect;
export type InsertSlaLog = typeof slaLogs.$inferInsert;
export type EmailConfig = typeof emailConfigs.$inferSelect;
export type InsertEmailConfig = typeof emailConfigs.$inferInsert;
export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;
export type CustomBranding = z.infer<typeof customBrandingSchema>;
export type CustomField = z.infer<typeof customFieldSchema>;

// Authentication types
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
