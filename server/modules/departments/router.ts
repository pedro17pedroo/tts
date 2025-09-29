import { Router } from "express";
import { DepartmentsController } from "./controller";
import { isAuthenticated } from "../../auth";
import type { AuthenticatedRequest } from "../../shared/base-types";
import type { Request, Response } from "express";

const router = Router();
const departmentsController = new DepartmentsController();

// Helper to cast request to AuthenticatedRequest after isAuthenticated middleware
const withAuth = (handler: (req: AuthenticatedRequest, res: Response) => Promise<any>) => {
  return (req: Request, res: Response) => {
    return handler(req as AuthenticatedRequest, res);
  };
};

// Get departments
router.get('/', isAuthenticated, withAuth(departmentsController.getDepartments.bind(departmentsController)));

export { router as departmentsModule };

// Categories router
const categoriesRouter = Router();

// Get categories  
categoriesRouter.get('/', isAuthenticated, withAuth(departmentsController.getCategories.bind(departmentsController)));

export { categoriesRouter as categoriesModule };