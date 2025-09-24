import { BaseRepository } from "../../repositories/base.repository";
import type { Customer, InsertCustomer } from "@shared/schema";

export class CustomersRepository extends BaseRepository {
  async getCustomersByTenant(tenantId: string): Promise<Customer[]> {
    return this.storage.getCustomersByTenant(tenantId);
  }

  async getCustomer(id: string, tenantId: string): Promise<Customer | undefined> {
    return this.storage.getCustomer(id, tenantId);
  }

  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    return this.storage.createCustomer(customerData);
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    return this.storage.updateCustomer(id, updates);
  }
}