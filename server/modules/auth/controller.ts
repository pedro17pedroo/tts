import { type Request, Response, NextFunction } from "express";
import { AuthService } from "./service";
import type { AuthenticatedRequest, UserResponse, AuthErrorResponse } from "./types";

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response<UserResponse | AuthErrorResponse>) {
    try {
      const user = await this.service.getCurrentUser(req.user.claims);
      res.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  }
}