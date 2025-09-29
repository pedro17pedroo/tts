import { type Response } from "express";
import { KnowledgeBaseService } from "./service";
import { AuthService } from "../auth/service";
import { z } from "zod";
import type { 
  AuthenticatedRequest,
  ArticlesResponse
} from "./types";

// Simple validation schema
const createArticleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  summary: z.string().optional(),
  isPublic: z.boolean().default(false),
  categoryId: z.string().optional(),
});

export class KnowledgeBaseController {
  private service: KnowledgeBaseService;
  private authService: AuthService;

  constructor() {
    this.service = new KnowledgeBaseService();
    this.authService = new AuthService();
  }

  async getArticles(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      const isPublic = req.query.public === 'true' ? true : undefined;
      const articles = await this.service.getArticlesByTenant(user.tenantId, isPublic);
      return res.json({ articles });
    } catch (error) {
      console.error("Erro ao buscar artigos:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async createArticle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      const validatedData = createArticleSchema.parse(req.body);
      const articleData = {
        ...validatedData,
        tenantId: user.tenantId,
        authorId: userId,
      };

      const article = await this.service.createArticle(articleData);
      return res.json({ article });
    } catch (error) {
      console.error("Erro ao criar artigo:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}