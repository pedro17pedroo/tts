import express, { type Express, type Request, Response, NextFunction } from "express";
import { log } from "../vite";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";

export function createApp(): Express {
  const app = express();
  
  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Request logging middleware
  app.use(requestLogger);
  
  return app;
}

export function setupErrorHandling(app: Express): void {
  // Error handler should be added after routes
  app.use(errorHandler);
}