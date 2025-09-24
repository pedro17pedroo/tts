import { type Response } from "express";
import { KnowledgeBaseService } from "./service";
import { AuthService } from "../auth/service";
import { insertArticleSchema } from "@shared/schema";
import type { 
  AuthenticatedRequest,
  ArticlesResponse
} from "./types";

export class KnowledgeBaseController {
  private service: KnowledgeBaseService;
  private authService: AuthService;

  constructor() {
    this.service = new KnowledgeBaseService();
    this.authService = new AuthService();
  }

  async getArticles(req: AuthenticatedRequest, res: Response<ArticlesResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const isPublic = req.query.public === 'true' ? true : undefined;
      const articles = await this.service.getArticlesByTenant(user.tenantId, isPublic);
      res.json({ articles });
    } catch (error) {
      console.error("Articles fetch error:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  }

  async createArticle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertArticleSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
        authorId: userId,
      });

      const article = await this.service.createArticle(data);
      res.json(article);
    } catch (error) {
      console.error("Article creation error:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  }
}