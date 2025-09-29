import type { Article, InsertArticle } from "../../schema";
import type { AuthenticatedRequest as BaseAuthenticatedRequest } from "../../shared/base-types";

export type AuthenticatedRequest = BaseAuthenticatedRequest;
export type ArticleData = Article;
export type CreateArticleData = InsertArticle;

// Response types
export interface ArticlesResponse {
  articles: ArticleData[];
}