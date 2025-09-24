import { Router } from "express";
import { AuthController } from "./controller";
import { isAuthenticated } from "../../auth";

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', (req: any, res) => 
  authController.register(req, res)
);

router.post('/login', (req: any, res) => 
  authController.login(req, res)
);

router.post('/logout', (req: any, res) => 
  authController.logout(req, res)
);

// Get current user (protected)
router.get('/user', isAuthenticated, (req: any, res) => 
  authController.getCurrentUser(req, res)
);

// Session verification
router.get('/verify-session', (req: any, res) => 
  authController.verifySession(req, res)
);

// Password management
router.post('/forgot-password', (req: any, res) => 
  authController.forgotPassword(req, res)
);

router.post('/reset-password', (req: any, res) => 
  authController.resetPassword(req, res)
);

router.post('/change-password', isAuthenticated, (req: any, res) => 
  authController.changePassword(req, res)
);

export { router as authModule };