import { HourBankRepository } from "./repository";
import type { HourBank, InsertHourBank, TimeEntry, InsertTimeEntry } from "../../schema";

export class HourBankService {
  private repository: HourBankRepository;

  constructor() {
    this.repository = new HourBankRepository();
  }

  async getHourBanksByTenant(tenantId: string): Promise<HourBank[]> {
    return this.repository.getHourBanksByTenant(tenantId);
  }

  async getHourBanksByCustomer(customerId: string): Promise<HourBank[]> {
    return this.repository.getHourBanksByCustomer(customerId);
  }

  async createHourBank(hourBankData: InsertHourBank): Promise<HourBank> {
    return this.repository.createHourBank(hourBankData);
  }

  async updateHourBank(id: string, updates: Partial<HourBank>): Promise<HourBank> {
    return this.repository.updateHourBank(id, updates);
  }

  async createTimeEntry(timeEntryData: InsertTimeEntry): Promise<TimeEntry> {
    return this.repository.createTimeEntry(timeEntryData);
  }

  async updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    return this.repository.updateTimeEntry(id, updates);
  }

  async getTimeEntriesByTicket(ticketId: string): Promise<TimeEntry[]> {
    return this.repository.getTimeEntriesByTicket(ticketId);
  }
}