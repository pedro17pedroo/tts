// Tipos compartilhados baseados no schema do servidor
// Este arquivo contém os tipos principais usados no cliente

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  passwordHash?: string | null;
  resetToken?: string | null;
  resetTokenExpires?: Date | null;
  emailVerified?: boolean | null;
  emailVerifyToken?: string | null;
  role: 'global_admin' | 'tenant_admin' | 'agent' | 'customer';
  tenantId?: string | null;
  isActive?: boolean | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Tenant {
  id: string;
  name: string;
  nif?: string | null;
  domain?: string | null;
  planType: 'free' | 'pro' | 'enterprise';
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus?: string | null;
  maxUsers?: number | null;
  maxTickets?: number | null;
  maxStorage?: number | null;
  customBranding?: any;
  locale?: string | null;
  currency?: string | null;
  timezone?: string | null;
  dateFormat?: string | null;
  timeFormat?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  tenantId: string;
  createdAt?: Date | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  tenantId: string;
  createdAt?: Date | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  tenantId: string;
  userId?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tenantId: string;
  customerId: string;
  assigneeId?: string | null;
  departmentId?: string | null;
  categoryId?: string | null;
  timeSpent?: string | null;
  slaFirstResponseAt?: Date | null;
  slaResolutionAt?: Date | null;
  firstResponseAt?: Date | null;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  isInternal?: boolean | null;
  createdAt?: Date | null;
}

export interface HourBank {
  id: string;
  customerId: string;
  tenantId: string;
  totalHours: string;
  consumedHours?: string | null;
  hourlyRate?: string | null;
  expiresAt?: Date | null;
  isActive?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface TimeEntry {
  id: string;
  ticketId: string;
  userId: string;
  startTime: Date;
  endTime?: Date | null;
  duration?: string | null;
  description?: string | null;
  hourBankId?: string | null;
  createdAt?: Date | null;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  isPublic?: boolean | null;
  tenantId: string;
  authorId: string;
  categoryId?: string | null;
  viewCount?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

// Tipos de autenticação
export interface RegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId?: string;
  role?: 'global_admin' | 'tenant_admin' | 'agent' | 'customer';
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  token: string;
  password: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

// Tipos de inserção (para formulários)
export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertTenant = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertDepartment = Omit<Department, 'id' | 'createdAt'>;
export type InsertCategory = Omit<Category, 'id' | 'createdAt'>;
export type InsertCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertTicketComment = Omit<TicketComment, 'id' | 'createdAt'>;
export type InsertHourBank = Omit<HourBank, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertTimeEntry = Omit<TimeEntry, 'id' | 'createdAt'>;
export type InsertArticle = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;