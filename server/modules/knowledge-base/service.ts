import { KnowledgeBaseRepository } from "./repository";
import type { Article, InsertArticle } from "../../schema";

export class KnowledgeBaseService {
  private repository: KnowledgeBaseRepository;

  constructor() {
    this.repository = new KnowledgeBaseRepository();
  }

  async getArticlesByTenant(tenantId: string, isPublic?: boolean): Promise<Article[]> {
    return this.repository.getArticlesByTenant(tenantId, isPublic);
  }

  async getArticle(id: string, tenantId: string): Promise<Article | undefined> {
    return this.repository.getArticle(id, tenantId);
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    return this.repository.createArticle(articleData);
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    return this.repository.updateArticle(id, updates);
  }

  async searchArticles(tenantId: string, query: string): Promise<Article[]> {
    return this.repository.searchArticles(tenantId, query);
  }
}