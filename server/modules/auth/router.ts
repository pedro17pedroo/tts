import { Router } from "express";
import { AuthController } from "./controller";
import { isAuthenticated } from "../../replitAuth";

const router = Router();
const authController = new AuthController();

// Get current user
router.get('/user', isAuthenticated, (req: any, res) => 
  authController.getCurrentUser(req, res)
);

export { router as authModule };