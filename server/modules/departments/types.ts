import type { Department, Category } from "../../schema";
import type { AuthenticatedRequest } from "../../shared/base-types";

export type DepartmentData = Department;
export type CategoryData = Category;

// Export the global AuthenticatedRequest for consistency
export type { AuthenticatedRequest };

// Response types
export interface DepartmentsResponse {
  departments: DepartmentData[];
}

export interface CategoriesResponse {
  categories: CategoryData[];
}