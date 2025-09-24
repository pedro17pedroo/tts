import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import type { User } from "@shared/schema";
import { AuthService } from "./modules/auth/service";

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-please-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Token generation
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Session helpers
export function setUserSession(req: any, user: User): void {
  req.session.userId = user.id;
  req.session.userEmail = user.email;
  req.session.userRole = user.role;
  req.session.tenantId = user.tenantId;
}

export function clearUserSession(req: any): void {
  req.session.userId = null;
  req.session.userEmail = null;
  req.session.userRole = null;
  req.session.tenantId = null;
}

// Authentication middleware
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const authService = new AuthService();
    const user = await authService.getUserById(userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach user to request
    (req as any).user = user;
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Role-based middleware
export function requireRole(...roles: string[]): RequestHandler {
  return async (req, res, next) => {
    const user = (req as any).user;
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    
    return next();
  };
}

// Tenant-based middleware
export function requireTenant(tenantId?: string): RequestHandler {
  return async (req, res, next) => {
    const user = (req as any).user;
    const targetTenantId = tenantId || req.params.tenantId || req.body.tenantId;
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Global admins can access any tenant
    if (user.role === 'global_admin') {
      return next();
    }

    // Other users must belong to the tenant
    if (!user.tenantId || user.tenantId !== targetTenantId) {
      return res.status(403).json({ message: "Forbidden: Access denied to this tenant" });
    }
    
    return next();
  };
}

// Setup auth for Express app
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
}

// Utility to check if token is expired
export function isTokenExpired(expires: Date | null): boolean {
  if (!expires) return true;
  return new Date() > new Date(expires);
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}