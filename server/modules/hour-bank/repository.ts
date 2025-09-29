import { BaseRepository } from "../../repositories/base.repository";
import type { HourBank, InsertHourBank, TimeEntry, InsertTimeEntry } from "../../schema";

export class HourBankRepository extends BaseRepository {
  async getHourBanksByTenant(tenantId: string): Promise<HourBank[]> {
    return this.storage.getHourBanksByTenant(tenantId);
  }

  async getHourBanksByCustomer(customerId: string): Promise<HourBank[]> {
    return this.storage.getHourBanksByCustomer(customerId);
  }

  async createHourBank(hourBankData: InsertHourBank): Promise<HourBank> {
    return this.storage.createHourBank(hourBankData);
  }

  async updateHourBank(id: string, updates: Partial<HourBank>): Promise<HourBank> {
    return this.storage.updateHourBank(id, updates);
  }

  async getTimeEntriesByTicket(ticketId: string): Promise<TimeEntry[]> {
    return this.storage.getTimeEntriesByTicket(ticketId);
  }

  async createTimeEntry(timeEntryData: InsertTimeEntry): Promise<TimeEntry> {
    return this.storage.createTimeEntry(timeEntryData);
  }

  async updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    return this.storage.updateTimeEntry(id, updates);
  }
}