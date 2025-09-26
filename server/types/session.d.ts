import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    tenantId?: string;
  }
}