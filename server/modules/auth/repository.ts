import { BaseRepository } from "../../repositories/base.repository";
import type { User, UpsertUser } from "@shared/schema";

export class AuthRepository extends BaseRepository {
  async getUser(id: string): Promise<User | undefined> {
    return this.storage.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.storage.getUserByEmail(email);
  }

  async createUser(userData: Omit<UpsertUser, 'id'>): Promise<User> {
    return this.storage.createUser(userData);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    return this.storage.upsertUser(userData);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.storage.updateUser(id, updates);
  }

  async getUserByTenant(userId: string, tenantId: string): Promise<User | undefined> {
    return this.storage.getUserByTenant(userId, tenantId);
  }

  async setResetToken(email: string, token: string, expires: Date): Promise<void> {
    return this.storage.setResetToken(email, token, expires);
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return this.storage.getUserByResetToken(token);
  }

  async clearResetToken(userId: string): Promise<void> {
    return this.storage.clearResetToken(userId);
  }
}