import { type Request } from "express";
import type { Article, InsertArticle } from "@shared/schema";

export type ArticleData = Article;
export type CreateArticleData = InsertArticle;

// Request types
export interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_image_url: string;
    };
  };
}

// Response types
export interface ArticlesResponse {
  articles: ArticleData[];
}