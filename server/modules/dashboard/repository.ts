import { BaseRepository } from "../../repositories/base.repository";

export class DashboardRepository extends BaseRepository {
  async getDashboardStats(tenantId: string): Promise<any> {
    return this.storage.getDashboardStats(tenantId);
  }
}