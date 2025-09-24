import { BaseRepository } from "../../repositories/base.repository";
import type { User, UpsertUser } from "@shared/schema";

export class AuthRepository extends BaseRepository {
  async getUser(id: string): Promise<User | undefined> {
    return this.storage.getUser(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    return this.storage.upsertUser(userData);
  }

  async getUserByTenant(userId: string, tenantId: string): Promise<User | undefined> {
    return this.storage.getUserByTenant(userId, tenantId);
  }
}