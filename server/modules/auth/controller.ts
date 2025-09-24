import { type Response } from "express";
import { BaseController } from "../../shared/base-controller";
import { AuthService } from "./service";
import type { AuthenticatedRequest, UserResponse } from "./types";

export class AuthController extends BaseController {
  private service: AuthService;

  constructor() {
    super();
    this.service = new AuthService();
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response<UserResponse>) {
    try {
      const user = await this.service.getCurrentUser(req.user.claims);
      this.sendSuccess(res, user);
    } catch (error) {
      this.handleError(error, res, "Failed to fetch user");
    }
  }
}