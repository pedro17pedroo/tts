import { type Response } from "express";
import { DepartmentsService } from "./service";
import { AuthService } from "../auth/service";
import type { 
  AuthenticatedRequest,
  DepartmentsResponse,
  CategoriesResponse
} from "./types";

export class DepartmentsController {
  private service: DepartmentsService;
  private authService: AuthService;

  constructor() {
    this.service = new DepartmentsService();
    this.authService = new AuthService();
  }

  async getDepartments(req: AuthenticatedRequest, res: Response<DepartmentsResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const departments = await this.service.getDepartmentsByTenant(user.tenantId);
      res.json({ departments });
    } catch (error) {
      console.error("Departments fetch error:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  }

  async getCategories(req: AuthenticatedRequest, res: Response<CategoriesResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const categories = await this.service.getCategoriesByTenant(user.tenantId);
      res.json({ categories });
    } catch (error) {
      console.error("Categories fetch error:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  }
}