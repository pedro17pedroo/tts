import { type Response } from "express";
import { AuthService } from "../modules/auth/service";
import type { AuthenticatedRequest, ErrorResponse, ApiResponse } from "./base-types";

export abstract class BaseController {
  protected authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Standard error handler
  protected handleError(error: any, res: Response, defaultMessage: string = "Internal server error"): void {
    console.error(`Controller error:`, error);
    
    const errorResponse: ErrorResponse = {
      success: false,
      message: error.message || defaultMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    res.status(500).json(errorResponse);
  }

  // Standard validation error handler
  protected handleValidationError(error: any, res: Response): void {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Validation failed",
      error: error.message
    };

    res.status(400).json(errorResponse);
  }

  // Standard not found handler
  protected handleNotFound(res: Response, message: string = "Resource not found"): void {
    const errorResponse: ErrorResponse = {
      success: false,
      message
    };

    res.status(404).json(errorResponse);
  }

  // Standard unauthorized handler
  protected handleUnauthorized(res: Response, message: string = "Unauthorized"): void {
    const errorResponse: ErrorResponse = {
      success: false,
      message
    };

    res.status(401).json(errorResponse);
  }

  // Standard forbidden handler
  protected handleForbidden(res: Response, message: string = "Forbidden"): void {
    const errorResponse: ErrorResponse = {
      success: false,
      message
    };

    res.status(403).json(errorResponse);
  }

  // Get authenticated user with tenant validation
  protected async getAuthenticatedUser(req: AuthenticatedRequest): Promise<{user: any, tenantId: string} | null> {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return null;
      }

      return { user, tenantId: user.tenantId };
    } catch (error) {
      console.error("Error getting authenticated user:", error);
      return null;
    }
  }

  // Success response helper
  protected sendSuccess<T>(res: Response, data: T, message?: string): void {
    res.json({
      success: true,
      data,
      message
    });
  }

  // Success response with status
  protected sendSuccessWithStatus<T>(res: Response, status: number, data: T, message?: string): void {
    res.status(status).json({
      success: true,
      data,
      message
    });
  }
}