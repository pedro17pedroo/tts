import { type Request } from "express";

// Base Response Types
export interface BaseResponse {
  success?: boolean;
  message?: string;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  message: string;
  error?: string;
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data?: T;
}

// Generic API Response that can be either success or error
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Authenticated Request interface (shared across all modules)
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

// Base Controller Interface
export interface BaseController {
  // All controllers should have these base methods available
}

// Base Service Interface
export interface BaseService {
  // All services should implement basic CRUD operations
}

// Base Repository Interface
export interface BaseRepositoryInterface {
  // All repositories should extend from base
}

// Filter interface for common filtering patterns
export interface BaseFilters {
  [key: string]: string | number | boolean | undefined;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends SuccessResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}