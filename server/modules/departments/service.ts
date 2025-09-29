import { DepartmentsRepository } from "./repository";
import type { Department, Category } from "../../schema";

export class DepartmentsService {
  private repository: DepartmentsRepository;

  constructor() {
    this.repository = new DepartmentsRepository();
  }

  async getDepartmentsByTenant(tenantId: string): Promise<Department[]> {
    return this.repository.getDepartmentsByTenant(tenantId);
  }

  async getCategoriesByTenant(tenantId: string): Promise<Category[]> {
    return this.repository.getCategoriesByTenant(tenantId);
  }
}