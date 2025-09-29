import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { emailConfigs, emailLogs, EmailConfig, InsertEmailConfig, EmailLog, InsertEmailLog } from "../../schema";
import { BaseRepository } from "../../repositories/base.repository";

export class EmailRepository extends BaseRepository {
  // Email Config methods
  async createEmailConfig(data: InsertEmailConfig): Promise<EmailConfig> {
    const [config] = await db.insert(emailConfigs).values(data).returning();
    return config;
  }

  async getEmailConfigByTenant(tenantId: string): Promise<EmailConfig | null> {
    const [config] = await db
      .select()
      .from(emailConfigs)
      .where(eq(emailConfigs.tenantId, tenantId))
      .limit(1);
    
    return config || null;
  }

  async getEmailConfigByInboundEmail(inboundEmail: string): Promise<EmailConfig | null> {
    const [config] = await db
      .select()
      .from(emailConfigs)
      .where(eq(emailConfigs.inboundEmail, inboundEmail))
      .limit(1);
    
    return config || null;
  }

  async updateEmailConfig(tenantId: string, data: Partial<InsertEmailConfig>): Promise<EmailConfig | null> {
    const [config] = await db
      .update(emailConfigs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(emailConfigs.tenantId, tenantId))
      .returning();
    
    return config || null;
  }

  async deleteEmailConfig(tenantId: string): Promise<boolean> {
    const result = await db
      .delete(emailConfigs)
      .where(eq(emailConfigs.tenantId, tenantId));
    
    return (result.rowCount ?? 0) > 0;
  }

  // Email Log methods
  async createEmailLog(data: InsertEmailLog): Promise<EmailLog> {
    const [log] = await db.insert(emailLogs).values(data).returning();
    return log;
  }

  async getEmailLogsByTenant(tenantId: string, limit: number = 50): Promise<EmailLog[]> {
    return await db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.tenantId, tenantId))
      .orderBy(emailLogs.processedAt)
      .limit(limit);
  }

  async getEmailLogByMessageId(messageId: string): Promise<EmailLog | null> {
    const [log] = await db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.messageId, messageId))
      .limit(1);
    
    return log || null;
  }

  async getEmailLogsByStatus(status: string, limit: number = 50): Promise<EmailLog[]> {
    return await db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.status, status))
      .orderBy(emailLogs.processedAt)
      .limit(limit);
  }

  async updateEmailLogStatus(id: string, status: string, errorMessage?: string): Promise<EmailLog | null> {
    const updateData: any = { status };
    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    const [log] = await db
      .update(emailLogs)
      .set(updateData)
      .where(eq(emailLogs.id, id))
      .returning();
    
    return log || null;
  }
}