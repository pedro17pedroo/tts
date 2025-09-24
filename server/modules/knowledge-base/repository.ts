import { BaseRepository } from "../../repositories/base.repository";
import type { Article, InsertArticle } from "@shared/schema";

export class KnowledgeBaseRepository extends BaseRepository {
  async getArticlesByTenant(tenantId: string, isPublic?: boolean): Promise<Article[]> {
    return this.storage.getArticlesByTenant(tenantId, isPublic);
  }

  async getArticle(id: string, tenantId: string): Promise<Article | undefined> {
    return this.storage.getArticle(id, tenantId);
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    return this.storage.createArticle(articleData);
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    return this.storage.updateArticle(id, updates);
  }

  async searchArticles(tenantId: string, query: string): Promise<Article[]> {
    return this.storage.searchArticles(tenantId, query);
  }
}