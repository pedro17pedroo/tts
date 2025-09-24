import { type Request } from "express";
import type { Department, Category } from "@shared/schema";

export type DepartmentData = Department;
export type CategoryData = Category;

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
export interface DepartmentsResponse {
  departments: DepartmentData[];
}

export interface CategoriesResponse {
  categories: CategoryData[];
}