import * as crypto from "crypto";
import { AuthRepository } from "./repository";
import { hashPassword, comparePassword, generateResetToken, isTokenExpired } from "../../auth";
import { sendEmail } from "../../clients/email.client";
import type { User, UpsertUser, RegisterUser, LoginUser, ForgotPassword, ResetPassword, ChangePassword } from "@shared/schema";

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.repository.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.repository.getUserByEmail(email);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    return this.repository.upsertUser(userData);
  }

  async getUserByTenant(userId: string, tenantId: string): Promise<User | undefined> {
    return this.repository.getUserByTenant(userId, tenantId);
  }

  // Registration
  async register(registerData: RegisterUser): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(registerData.email);
    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    // Hash password
    const passwordHash = await hashPassword(registerData.password);

    // Create user
    const userData = {
      email: registerData.email,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      passwordHash,
      role: registerData.role || 'customer',
      tenantId: registerData.tenantId || null,
      emailVerified: false,
      isActive: true,
    };

    const user = await this.repository.createUser(userData);

    // TODO: Send verification email
    // await this.sendVerificationEmail(user);

    return user;
  }

  // Login
  async login(loginData: LoginUser): Promise<User> {
    const user = await this.getUserByEmail(loginData.email);
    
    if (!user || !user.passwordHash) {
      throw new Error("Credenciais inválidas");
    }

    if (!user.isActive) {
      throw new Error("Conta desativada");
    }

    const isPasswordValid = await comparePassword(loginData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }

    return user;
  }

  // Forgot password
  async forgotPassword(forgotData: ForgotPassword): Promise<void> {
    const user = await this.getUserByEmail(forgotData.email);
    
    if (!user) {
      // Don't reveal if email exists - security best practice
      return;
    }

    const resetToken = generateResetToken();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.repository.setResetToken(forgotData.email, resetToken, expires);

    // Send reset email
    await this.sendPasswordResetEmail(user, resetToken);
  }

  // Reset password
  async resetPassword(resetData: ResetPassword): Promise<void> {
    const user = await this.repository.getUserByResetToken(resetData.token);
    
    if (!user || !user.resetToken || !user.resetTokenExpires) {
      throw new Error("Token inválido ou expirado");
    }

    if (isTokenExpired(user.resetTokenExpires)) {
      throw new Error("Token expirado");
    }

    // Hash new password
    const passwordHash = await hashPassword(resetData.password);

    // Update user
    await this.repository.updateUser(user.id, { passwordHash });
    
    // Clear reset token
    await this.repository.clearResetToken(user.id);
  }

  // Change password
  async changePassword(userId: string, changeData: ChangePassword): Promise<void> {
    const user = await this.getUserById(userId);
    
    if (!user || !user.passwordHash) {
      throw new Error("Usuário não encontrado");
    }

    const isCurrentPasswordValid = await comparePassword(changeData.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error("Senha atual incorreta");
    }

    // Hash new password
    const passwordHash = await hashPassword(changeData.newPassword);

    // Update user
    await this.repository.updateUser(userId, { passwordHash });
  }

  // Get current user (for session-based auth)
  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.getUserById(userId);
    
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  // Send password reset email
  private async sendPasswordResetEmail(user: User, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const emailHtml = `
      <h2>Redefinir Senha</h2>
      <p>Olá ${user.firstName},</p>
      <p>Você solicitou a redefinição de senha para sua conta no TatuTicket.</p>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Redefinir Senha
      </a>
      <p>Este link expira em 1 hora.</p>
      <p>Se você não solicitou esta redefinição, ignore este email.</p>
      <p>Atenciosamente,<br>Equipe TatuTicket</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Redefinir Senha - TatuTicket",
        html: emailHtml,
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // Don't throw error to prevent leaking email sending status
    }
  }

  // Verify email (optional implementation)
  async verifyEmail(token: string): Promise<void> {
    // TODO: Implement email verification if needed
    // Find user by verification token and mark email as verified
  }

  // Create first global admin (for system setup)
  async createGlobalAdmin(adminData: RegisterUser): Promise<User> {
    const userData = {
      ...adminData,
      role: 'global_admin' as const,
      tenantId: null,
    };
    return this.register(userData);
  }
}