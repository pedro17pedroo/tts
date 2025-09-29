import { type Request, type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { AuthService } from "./service";
import { setUserSession, clearUserSession } from "../../auth";
import { 
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} from "../../schema";
import type { AuthenticatedRequest, UserResponse } from "./types";

export class AuthController extends BaseController {
  private service: AuthService;

  constructor() {
    super();
    this.service = new AuthService();
  }

  // Register new user
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      const user = await this.service.register(validatedData);
      
      // Set user session
      setUserSession(req, user);
      
      // Return user without password hash
      const { passwordHash, resetToken, resetTokenExpires, emailVerifyToken, ...userResponse } = user;
      return this.sendSuccess(res, userResponse);
    } catch (error) {
      return this.handleError(error, res, "Falha no registro");
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      const user = await this.service.login(validatedData);
      
      // Set user session
      setUserSession(req, user);
      
      // Return user without password hash
      const { passwordHash, resetToken, resetTokenExpires, emailVerifyToken, ...userResponse } = user;
      return this.sendSuccess(res, userResponse);
    } catch (error) {
      return this.handleError(error, res, "Falha no login");
    }
  }

  // Logout user
  async logout(req: Request, res: Response) {
    try {
      clearUserSession(req);
      return this.sendSuccess(res, { message: "Logout realizado com sucesso" });
    } catch (error) {
      return this.handleError(error, res, "Falha no logout");
    }
  }

  // Get current user
  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await this.service.getCurrentUser(userId);
      
      // Return user without sensitive fields
      const { passwordHash, resetToken, resetTokenExpires, emailVerifyToken, ...userResponse } = user;
      return this.sendSuccess(res, userResponse);
    } catch (error) {
      return this.handleError(error, res, "Falha ao buscar usuário");
    }
  }

  // Forgot password
  async forgotPassword(req: Request, res: Response) {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      await this.service.forgotPassword(validatedData);
      
      // Always return success to prevent email enumeration
      return this.sendSuccess(res, { 
        message: "Se o email existir, instruções de reset foram enviadas" 
      });
    } catch (error) {
      // Always return success for security
      return this.sendSuccess(res, { 
        message: "Se o email existir, instruções de reset foram enviadas" 
      });
    }
  }

  // Reset password
  async resetPassword(req: Request, res: Response) {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      await this.service.resetPassword(validatedData);
      
      return this.sendSuccess(res, { message: "Senha redefinida com sucesso" });
    } catch (error) {
      return this.handleError(error, res, "Falha ao redefinir senha");
    }
  }

  // Change password
  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = changePasswordSchema.parse(req.body);
      await this.service.changePassword(userId, validatedData);
      
      return this.sendSuccess(res, { message: "Senha alterada com sucesso" });
    } catch (error) {
      return this.handleError(error, res, "Falha ao alterar senha");
    }
  }

  // Verify session
  async verifySession(req: Request, res: Response) {
    try {
      const userId = req.session?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "No active session" });
      }
      
      const user = await this.service.getCurrentUser(userId);
      
      // Return user without sensitive fields
      const { passwordHash, resetToken, resetTokenExpires, emailVerifyToken, ...userResponse } = user;
      return this.sendSuccess(res, userResponse);
    } catch (error) {
      return res.status(401).json({ message: "Invalid session" });
    }
  }
}