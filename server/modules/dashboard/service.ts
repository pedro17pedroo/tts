import { DashboardRepository } from "./repository";

export class DashboardService {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  async getDashboardStats(tenantId: string): Promise<any> {
    return this.repository.getDashboardStats(tenantId);
  }
}