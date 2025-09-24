import { AuthRepository } from "./repository";
import type { User, UpsertUser } from "@shared/schema";

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.repository.getUser(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    return this.repository.upsertUser(userData);
  }

  async getUserByTenant(userId: string, tenantId: string): Promise<User | undefined> {
    return this.repository.getUserByTenant(userId, tenantId);
  }

  async getCurrentUser(userClaims: any): Promise<User> {
    const userId = userClaims.sub;
    let user = await this.getUserById(userId);

    if (!user) {
      // Create user if not exists
      user = await this.upsertUser({
        id: userId,
        email: userClaims.email,
        firstName: userClaims.first_name,
        lastName: userClaims.last_name,
        profileImageUrl: userClaims.profile_image_url,
      });
    }

    return user;
  }
}