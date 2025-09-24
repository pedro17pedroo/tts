import { Router } from "express";
import { KnowledgeBaseController } from "./controller";
import { isAuthenticated } from "../../replitAuth";

const router = Router();
const knowledgeBaseController = new KnowledgeBaseController();

// Get articles
router.get('/', isAuthenticated, (req: any, res) =>
  knowledgeBaseController.getArticles(req, res)
);

// Create article
router.post('/', isAuthenticated, (req: any, res) =>
  knowledgeBaseController.createArticle(req, res)
);

export { router as knowledgeBaseModule };