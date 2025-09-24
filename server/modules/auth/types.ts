import { z } from "zod";
import { type Request } from "express";
import type { User, UpsertUser } from "@shared/schema";

export type AuthUser = User;
export type UpsertAuthUser = UpsertUser;

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
export interface UserResponse {
  user: AuthUser;
}

export interface AuthErrorResponse {
  message: string;
}