import type { User, UpsertUser } from "@shared/schema";
import type { 
  AuthenticatedRequest, 
  SuccessResponse,
  ErrorResponse
} from "../../shared/base-types";

export type AuthUser = User;
export type UpsertAuthUser = UpsertUser;

// Re-export AuthenticatedRequest from base types
export type { AuthenticatedRequest };

// Success response types
export interface UserSuccessResponse extends SuccessResponse<AuthUser> {
  success: true;
  data: AuthUser;
}

// API Response types (can be success or error)
export type UserResponse = UserSuccessResponse | ErrorResponse;