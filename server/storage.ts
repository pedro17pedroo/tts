import {
  users,
  tenants,
  customers,
  tickets,
  ticketComments,
  hourBanks,
  timeEntries,
  articles,
  departments,
  categories,
  slaConfigs,
  slaStatus,
  slaLogs,
  type User,
  type UpsertUser,
  type Tenant,
  type InsertTenant,
  type Customer,
  type InsertCustomer,
  type Ticket,
  type InsertTicket,
  type TicketComment,
  type InsertTicketComment,
  type HourBank,
  type InsertHourBank,
  type TimeEntry,
  type InsertTimeEntry,
  type Article,
  type InsertArticle,
  type Department,
  type InsertDepartment,
  type Category,
  type InsertCategory,
  type SlaConfig,
  type InsertSlaConfig,
  type SlaStatus,
  type InsertSlaStatus,
  type SlaLog,
  type InsertSlaLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, asc, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<UpsertUser, 'id'>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getUserByTenant(userId: string, tenantId: string): Promise<User | undefined>;
  
  // Password reset operations
  setResetToken(email: string, token: string, expires: Date): Promise<void>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  clearResetToken(userId: string): Promise<void>;
  
  // Tenant operations
  getTenant(id: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant>;
  
  // Customer operations
  getCustomersByTenant(tenantId: string): Promise<Customer[]>;
  getCustomer(id: string, tenantId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer>;
  
  // Ticket operations
  getTicketsByTenant(tenantId: string, filters?: any): Promise<Ticket[]>;
  getTicket(id: string, tenantId: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket>;
  getTicketComments(ticketId: string): Promise<TicketComment[]>;
  createTicketComment(comment: InsertTicketComment): Promise<TicketComment>;
  
  // Hour bank operations
  getHourBanksByTenant(tenantId: string): Promise<HourBank[]>;
  getHourBanksByCustomer(customerId: string): Promise<HourBank[]>;
  createHourBank(hourBank: InsertHourBank): Promise<HourBank>;
  updateHourBank(id: string, updates: Partial<HourBank>): Promise<HourBank>;
  
  // Time tracking operations
  getTimeEntriesByTicket(ticketId: string): Promise<TimeEntry[]>;
  createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry>;
  
  // Knowledge base operations
  getArticlesByTenant(tenantId: string, isPublic?: boolean): Promise<Article[]>;
  getArticle(id: string, tenantId: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: Partial<Article>): Promise<Article>;
  searchArticles(tenantId: string, query: string): Promise<Article[]>;
  
  // Department operations
  getDepartmentsByTenant(tenantId: string): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Category operations
  getCategoriesByTenant(tenantId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Dashboard stats
  getDashboardStats(tenantId: string): Promise<any>;
  
  // SLA Config operations
  getSlaConfigs(tenantId: string, filters?: any): Promise<SlaConfig[]>;
  getSlaConfig(id: string, tenantId: string): Promise<SlaConfig | undefined>;
  getSlaConfigByTenantAndPriority(tenantId: string, priority: string, categoryId?: string): Promise<SlaConfig | undefined>;
  createSlaConfig(slaConfig: InsertSlaConfig): Promise<SlaConfig>;
  updateSlaConfig(id: string, updates: Partial<SlaConfig>): Promise<SlaConfig>;
  deleteSlaConfig(id: string, tenantId: string): Promise<void>;
  
  // SLA Status operations
  getSlaStatusByTicket(ticketId: string): Promise<SlaStatus | undefined>;
  getSlaStatusesByTenant(tenantId: string, filters?: any): Promise<SlaStatus[]>;
  createSlaStatus(slaStatus: InsertSlaStatus): Promise<SlaStatus>;
  updateSlaStatus(id: string, updates: Partial<SlaStatus>): Promise<SlaStatus>;
  getSlaStatusesAtRisk(tenantId: string): Promise<SlaStatus[]>;
  getSlaStatusesBreached(tenantId: string): Promise<SlaStatus[]>;
  
  // SLA Logs operations
  getSlaLogs(tenantId: string, filters?: any): Promise<SlaLog[]>;
  getSlaLogsByTicket(ticketId: string): Promise<SlaLog[]>;
  createSlaLog(slaLog: InsertSlaLog): Promise<SlaLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'>): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserByTenant(userId: string, tenantId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)));
    return user;
  }

  // Password reset operations
  async setResetToken(email: string, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetToken: token, 
        resetTokenExpires: expires,
        updatedAt: new Date()
      })
      .where(eq(users.email, email));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, token));
    return user;
  }

  async clearResetToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetToken: null, 
        resetTokenExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Tenant operations
  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async createTenant(tenantData: InsertTenant): Promise<Tenant> {
    const [tenant] = await db.insert(tenants).values(tenantData).returning();
    return tenant;
  }

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    const [tenant] = await db
      .update(tenants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return tenant;
  }

  // Customer operations
  async getCustomersByTenant(tenantId: string): Promise<Customer[]> {
    return db
      .select()
      .from(customers)
      .where(eq(customers.tenantId, tenantId))
      .orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string, tenantId: string): Promise<Customer | undefined> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, id), eq(customers.tenantId, tenantId)));
    return customer;
  }

  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(customerData).returning();
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const [customer] = await db
      .update(customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return customer;
  }

  // Ticket operations
  async getTicketsByTenant(tenantId: string, filters?: any): Promise<Ticket[]> {
    const conditions = [eq(tickets.tenantId, tenantId)];

    if (filters?.status) {
      conditions.push(eq(tickets.status, filters.status));
    }
    
    if (filters?.priority) {
      conditions.push(eq(tickets.priority, filters.priority));
    }
    
    if (filters?.assigneeId) {
      conditions.push(eq(tickets.assigneeId, filters.assigneeId));
    }

    return db
      .select()
      .from(tickets)
      .where(and(...conditions))
      .orderBy(desc(tickets.createdAt));
  }

  async getTicket(id: string, tenantId: string): Promise<Ticket | undefined> {
    const [ticket] = await db
      .select()
      .from(tickets)
      .where(and(eq(tickets.id, id), eq(tickets.tenantId, tenantId)));
    return ticket;
  }

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    const [ticket] = await db.insert(tickets).values(ticketData).returning();
    return ticket;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    const [ticket] = await db
      .update(tickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return ticket;
  }

  async getTicketComments(ticketId: string): Promise<TicketComment[]> {
    return db
      .select()
      .from(ticketComments)
      .where(eq(ticketComments.ticketId, ticketId))
      .orderBy(asc(ticketComments.createdAt));
  }

  async createTicketComment(commentData: InsertTicketComment): Promise<TicketComment> {
    const [comment] = await db.insert(ticketComments).values(commentData).returning();
    return comment;
  }

  // Hour bank operations
  async getHourBanksByTenant(tenantId: string): Promise<HourBank[]> {
    return db
      .select()
      .from(hourBanks)
      .where(eq(hourBanks.tenantId, tenantId))
      .orderBy(desc(hourBanks.createdAt));
  }

  async getHourBanksByCustomer(customerId: string): Promise<HourBank[]> {
    return db
      .select()
      .from(hourBanks)
      .where(and(eq(hourBanks.customerId, customerId), eq(hourBanks.isActive, true)))
      .orderBy(desc(hourBanks.createdAt));
  }

  async createHourBank(hourBankData: InsertHourBank): Promise<HourBank> {
    const [hourBank] = await db.insert(hourBanks).values(hourBankData).returning();
    return hourBank;
  }

  async updateHourBank(id: string, updates: Partial<HourBank>): Promise<HourBank> {
    const [hourBank] = await db
      .update(hourBanks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(hourBanks.id, id))
      .returning();
    return hourBank;
  }

  // Time tracking operations
  async getTimeEntriesByTicket(ticketId: string): Promise<TimeEntry[]> {
    return db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.ticketId, ticketId))
      .orderBy(desc(timeEntries.createdAt));
  }

  async createTimeEntry(timeEntryData: InsertTimeEntry): Promise<TimeEntry> {
    const [timeEntry] = await db.insert(timeEntries).values(timeEntryData).returning();
    return timeEntry;
  }

  async updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    const [timeEntry] = await db
      .update(timeEntries)
      .set(updates)
      .where(eq(timeEntries.id, id))
      .returning();
    return timeEntry;
  }

  // Knowledge base operations
  async getArticlesByTenant(tenantId: string, isPublic?: boolean): Promise<Article[]> {
    const conditions = [eq(articles.tenantId, tenantId)];

    if (typeof isPublic === 'boolean') {
      conditions.push(eq(articles.isPublic, isPublic));
    }

    return db
      .select()
      .from(articles)
      .where(and(...conditions))
      .orderBy(desc(articles.createdAt));
  }

  async getArticle(id: string, tenantId: string): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(and(eq(articles.id, id), eq(articles.tenantId, tenantId)));
    return article;
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(articleData).returning();
    return article;
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const [article] = await db
      .update(articles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article;
  }

  async searchArticles(tenantId: string, query: string): Promise<Article[]> {
    return db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.tenantId, tenantId),
          or(
            ilike(articles.title, `%${query}%`),
            ilike(articles.content, `%${query}%`)
          )
        )
      );
  }

  // Department operations
  async getDepartmentsByTenant(tenantId: string): Promise<Department[]> {
    return db
      .select()
      .from(departments)
      .where(eq(departments.tenantId, tenantId))
      .orderBy(asc(departments.name));
  }

  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    const [department] = await db.insert(departments).values(departmentData).returning();
    return department;
  }

  // Category operations
  async getCategoriesByTenant(tenantId: string): Promise<Category[]> {
    return db
      .select()
      .from(categories)
      .where(eq(categories.tenantId, tenantId))
      .orderBy(asc(categories.name));
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  // Dashboard stats
  async getDashboardStats(tenantId: string): Promise<any> {
    const [openTickets] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .where(and(eq(tickets.tenantId, tenantId), eq(tickets.status, 'new')));

    const [inProgressTickets] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .where(and(eq(tickets.tenantId, tenantId), eq(tickets.status, 'in_progress')));

    const [resolvedToday] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .where(
        and(
          eq(tickets.tenantId, tenantId),
          eq(tickets.status, 'resolved'),
          sql`DATE(resolved_at) = CURRENT_DATE`
        )
      );

    const [totalHours] = await db
      .select({ 
        totalSold: sql<number>`COALESCE(SUM(total_hours), 0)`,
        consumed: sql<number>`COALESCE(SUM(consumed_hours), 0)`
      })
      .from(hourBanks)
      .where(and(eq(hourBanks.tenantId, tenantId), eq(hourBanks.isActive, true)));

    return {
      openTickets: openTickets.count || 0,
      inProgressTickets: inProgressTickets.count || 0,
      resolvedToday: resolvedToday.count || 0,
      slaAtRisk: 3, // TODO: Calculate based on SLA configs
      hourBank: {
        totalSold: totalHours.totalSold || 0,
        consumed: totalHours.consumed || 0,
        available: (totalHours.totalSold || 0) - (totalHours.consumed || 0),
      }
    };
  }

  // SLA Config operations
  async getSlaConfigs(tenantId: string, filters?: any): Promise<SlaConfig[]> {
    const conditions = [eq(slaConfigs.tenantId, tenantId)];

    if (filters?.categoryId) {
      conditions.push(eq(slaConfigs.categoryId, filters.categoryId));
    }
    
    if (filters?.priority) {
      conditions.push(eq(slaConfigs.priority, filters.priority));
    }
    
    if (typeof filters?.isActive === 'boolean') {
      conditions.push(eq(slaConfigs.isActive, filters.isActive));
    }

    return db
      .select()
      .from(slaConfigs)
      .where(and(...conditions))
      .orderBy(desc(slaConfigs.createdAt));
  }

  async getSlaConfig(id: string, tenantId: string): Promise<SlaConfig | undefined> {
    const [slaConfig] = await db
      .select()
      .from(slaConfigs)
      .where(and(eq(slaConfigs.id, id), eq(slaConfigs.tenantId, tenantId)));
    return slaConfig;
  }

  async getSlaConfigByTenantAndPriority(tenantId: string, priority: string, categoryId?: string): Promise<SlaConfig | undefined> {
    const conditions = [
      eq(slaConfigs.tenantId, tenantId), 
      eq(slaConfigs.priority, priority as any),
      eq(slaConfigs.isActive, true)
    ];

    if (categoryId) {
      conditions.push(eq(slaConfigs.categoryId, categoryId));
    } else {
      conditions.push(sql`${slaConfigs.categoryId} IS NULL`);
    }

    const [slaConfig] = await db
      .select()
      .from(slaConfigs)
      .where(and(...conditions))
      .orderBy(desc(slaConfigs.createdAt));
    
    return slaConfig;
  }

  async createSlaConfig(slaConfigData: InsertSlaConfig): Promise<SlaConfig> {
    const [slaConfig] = await db.insert(slaConfigs).values(slaConfigData).returning();
    return slaConfig;
  }

  async updateSlaConfig(id: string, updates: Partial<SlaConfig>): Promise<SlaConfig> {
    const [slaConfig] = await db
      .update(slaConfigs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(slaConfigs.id, id))
      .returning();
    return slaConfig;
  }

  async deleteSlaConfig(id: string, tenantId: string): Promise<void> {
    await db
      .delete(slaConfigs)
      .where(and(eq(slaConfigs.id, id), eq(slaConfigs.tenantId, tenantId)));
  }

  // SLA Status operations
  async getSlaStatusByTicket(ticketId: string): Promise<SlaStatus | undefined> {
    const [status] = await db
      .select()
      .from(slaStatus)
      .where(eq(slaStatus.ticketId, ticketId));
    return status;
  }

  async getSlaStatusesByTenant(tenantId: string, filters?: any): Promise<SlaStatus[]> {
    // Join with tickets to filter by tenant
    const conditions = [eq(tickets.tenantId, tenantId)];

    if (filters?.status) {
      conditions.push(
        or(
          eq(slaStatus.firstResponseStatus, filters.status as any),
          eq(slaStatus.resolutionStatus, filters.status as any)
        )
      );
    }

    if (filters?.dueToday) {
      conditions.push(
        or(
          sql`DATE(first_response_due_at) = CURRENT_DATE`,
          sql`DATE(resolution_due_at) = CURRENT_DATE`
        )
      );
    }

    if (filters?.overdue) {
      conditions.push(
        or(
          sql`first_response_due_at < NOW() AND first_response_at IS NULL`,
          sql`resolution_due_at < NOW() AND resolved_at IS NULL`
        )
      );
    }

    return db
      .select({ 
        id: slaStatus.id,
        ticketId: slaStatus.ticketId,
        slaConfigId: slaStatus.slaConfigId,
        firstResponseDueAt: slaStatus.firstResponseDueAt,
        resolutionDueAt: slaStatus.resolutionDueAt,
        firstResponseAt: slaStatus.firstResponseAt,
        resolvedAt: slaStatus.resolvedAt,
        firstResponseStatus: slaStatus.firstResponseStatus,
        resolutionStatus: slaStatus.resolutionStatus,
        firstResponseTimeRemaining: slaStatus.firstResponseTimeRemaining,
        resolutionTimeRemaining: slaStatus.resolutionTimeRemaining,
        firstResponseTimeSpent: slaStatus.firstResponseTimeSpent,
        resolutionTimeSpent: slaStatus.resolutionTimeSpent,
        firstResponseBreachedAt: slaStatus.firstResponseBreachedAt,
        resolutionBreachedAt: slaStatus.resolutionBreachedAt,
        createdAt: slaStatus.createdAt,
        updatedAt: slaStatus.updatedAt,
      })
      .from(slaStatus)
      .innerJoin(tickets, eq(slaStatus.ticketId, tickets.id))
      .where(and(...conditions))
      .orderBy(desc(slaStatus.updatedAt));
  }

  async createSlaStatus(slaStatusData: InsertSlaStatus): Promise<SlaStatus> {
    const [status] = await db.insert(slaStatus).values(slaStatusData).returning();
    return status;
  }

  async updateSlaStatus(id: string, updates: Partial<SlaStatus>): Promise<SlaStatus> {
    const [status] = await db
      .update(slaStatus)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(slaStatus.id, id))
      .returning();
    return status;
  }

  async getSlaStatusesAtRisk(tenantId: string): Promise<SlaStatus[]> {
    return db
      .select({
        id: slaStatus.id,
        ticketId: slaStatus.ticketId,
        slaConfigId: slaStatus.slaConfigId,
        firstResponseDueAt: slaStatus.firstResponseDueAt,
        resolutionDueAt: slaStatus.resolutionDueAt,
        firstResponseAt: slaStatus.firstResponseAt,
        resolvedAt: slaStatus.resolvedAt,
        firstResponseStatus: slaStatus.firstResponseStatus,
        resolutionStatus: slaStatus.resolutionStatus,
        firstResponseTimeRemaining: slaStatus.firstResponseTimeRemaining,
        resolutionTimeRemaining: slaStatus.resolutionTimeRemaining,
        firstResponseTimeSpent: slaStatus.firstResponseTimeSpent,
        resolutionTimeSpent: slaStatus.resolutionTimeSpent,
        firstResponseBreachedAt: slaStatus.firstResponseBreachedAt,
        resolutionBreachedAt: slaStatus.resolutionBreachedAt,
        createdAt: slaStatus.createdAt,
        updatedAt: slaStatus.updatedAt,
      })
      .from(slaStatus)
      .innerJoin(tickets, eq(slaStatus.ticketId, tickets.id))
      .where(
        and(
          eq(tickets.tenantId, tenantId),
          or(
            eq(slaStatus.firstResponseStatus, 'at_risk'),
            eq(slaStatus.resolutionStatus, 'at_risk')
          )
        )
      )
      .orderBy(desc(slaStatus.updatedAt));
  }

  async getSlaStatusesBreached(tenantId: string): Promise<SlaStatus[]> {
    return db
      .select({
        id: slaStatus.id,
        ticketId: slaStatus.ticketId,
        slaConfigId: slaStatus.slaConfigId,
        firstResponseDueAt: slaStatus.firstResponseDueAt,
        resolutionDueAt: slaStatus.resolutionDueAt,
        firstResponseAt: slaStatus.firstResponseAt,
        resolvedAt: slaStatus.resolvedAt,
        firstResponseStatus: slaStatus.firstResponseStatus,
        resolutionStatus: slaStatus.resolutionStatus,
        firstResponseTimeRemaining: slaStatus.firstResponseTimeRemaining,
        resolutionTimeRemaining: slaStatus.resolutionTimeRemaining,
        firstResponseTimeSpent: slaStatus.firstResponseTimeSpent,
        resolutionTimeSpent: slaStatus.resolutionTimeSpent,
        firstResponseBreachedAt: slaStatus.firstResponseBreachedAt,
        resolutionBreachedAt: slaStatus.resolutionBreachedAt,
        createdAt: slaStatus.createdAt,
        updatedAt: slaStatus.updatedAt,
      })
      .from(slaStatus)
      .innerJoin(tickets, eq(slaStatus.ticketId, tickets.id))
      .where(
        and(
          eq(tickets.tenantId, tenantId),
          or(
            eq(slaStatus.firstResponseStatus, 'breached'),
            eq(slaStatus.resolutionStatus, 'breached')
          )
        )
      )
      .orderBy(desc(slaStatus.updatedAt));
  }

  // SLA Logs operations
  async getSlaLogs(tenantId: string, filters?: any): Promise<SlaLog[]> {
    const conditions = [eq(slaLogs.tenantId, tenantId)];

    if (filters?.ticketId) {
      conditions.push(eq(slaLogs.ticketId, filters.ticketId));
    }
    
    if (filters?.action) {
      conditions.push(eq(slaLogs.action, filters.action as any));
    }
    
    if (filters?.eventType) {
      conditions.push(eq(slaLogs.eventType, filters.eventType));
    }

    if (filters?.dateFrom) {
      conditions.push(sql`${slaLogs.createdAt} >= ${filters.dateFrom}`);
    }

    if (filters?.dateTo) {
      conditions.push(sql`${slaLogs.createdAt} <= ${filters.dateTo}`);
    }

    return db
      .select()
      .from(slaLogs)
      .where(and(...conditions))
      .orderBy(desc(slaLogs.createdAt));
  }

  async getSlaLogsByTicket(ticketId: string): Promise<SlaLog[]> {
    return db
      .select()
      .from(slaLogs)
      .where(eq(slaLogs.ticketId, ticketId))
      .orderBy(desc(slaLogs.createdAt));
  }

  async createSlaLog(slaLogData: InsertSlaLog): Promise<SlaLog> {
    const [log] = await db.insert(slaLogs).values(slaLogData).returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
