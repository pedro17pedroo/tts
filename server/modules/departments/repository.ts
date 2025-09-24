import { BaseRepository } from "../../repositories/base.repository";
import type { Department, Category } from "@shared/schema";

export class DepartmentsRepository extends BaseRepository {
  async getDepartmentsByTenant(tenantId: string): Promise<Department[]> {
    return this.storage.getDepartmentsByTenant(tenantId);
  }

  async getCategoriesByTenant(tenantId: string): Promise<Category[]> {
    return this.storage.getCategoriesByTenant(tenantId);
  }
}