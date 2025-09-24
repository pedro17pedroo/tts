import { Router } from "express";
import { DepartmentsController } from "./controller";
import { isAuthenticated } from "../../auth";

const router = Router();
const departmentsController = new DepartmentsController();

// Get departments
router.get('/', isAuthenticated, (req: any, res) =>
  departmentsController.getDepartments(req, res)
);

export { router as departmentsModule };

// Categories router
const categoriesRouter = Router();

// Get categories  
categoriesRouter.get('/', isAuthenticated, (req: any, res) =>
  departmentsController.getCategories(req, res)
);

export { categoriesRouter as categoriesModule };