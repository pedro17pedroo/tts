import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    tenantId?: string;
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'global_admin' | 'tenant_admin' | 'agent' | 'customer';
      tenantId?: string;
      isActive: boolean;
      profileImageUrl?: string;
    }

    interface Request {
      user?: User;
      logout(callback: (err?: any) => void): void;
      isAuthenticated(): boolean;
    }
  }
}