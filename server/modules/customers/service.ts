import { CustomersRepository } from "./repository";
import type { Customer, InsertCustomer } from "../../schema";

export class CustomersService {
  private repository: CustomersRepository;

  constructor() {
    this.repository = new CustomersRepository();
  }

  async getCustomersByTenant(tenantId: string): Promise<Customer[]> {
    return this.repository.getCustomersByTenant(tenantId);
  }

  async getCustomer(id: string, tenantId: string): Promise<Customer | undefined> {
    return this.repository.getCustomer(id, tenantId);
  }

  async getCustomerByEmail(email: string, tenantId: string): Promise<Customer | undefined> {
    return this.repository.getCustomerByEmail(email, tenantId);
  }

  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    return this.repository.createCustomer(customerData);
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    return this.repository.updateCustomer(id, updates);
  }
}