import { BaseRepository } from "../../repositories/base.repository";
import type { Tenant, InsertTenant, InsertDepartment, InsertCategory } from "@shared/schema";

export class TenantsRepository extends BaseRepository {
  async getTenant(id: string): Promise<Tenant | undefined> {
    return this.storage.getTenant(id);
  }

  async createTenant(tenantData: InsertTenant): Promise<Tenant> {
    return this.storage.createTenant(tenantData);
  }

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    return this.storage.updateTenant(id, updates);
  }

  async createDepartment(departmentData: InsertDepartment) {
    return this.storage.createDepartment(departmentData);
  }

  async createCategory(categoryData: InsertCategory) {
    return this.storage.createCategory(categoryData);
  }
}