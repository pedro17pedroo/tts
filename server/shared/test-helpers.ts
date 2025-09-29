import { type Request, type Response } from "express";
import type { AuthenticatedRequest } from "./base-types";

// Mock response object for testing
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: (() => res) as any,
    json: (() => res) as any,
    send: (() => res) as any,
  };
  return res;
};

// Mock authenticated request for testing
export const createMockAuthenticatedRequest = (overrides?: Partial<AuthenticatedRequest>): Partial<AuthenticatedRequest> => {
  const baseRequest: Partial<AuthenticatedRequest> = {
    user: {
      id: "test-user-id",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "customer",
      tenantId: "test-tenant-123",
      isActive: true,
      profileImageUrl: "https://example.com/avatar.png",
    },
    params: {},
    query: {},
    body: {},
    ...overrides,
  };
  return baseRequest;
};

// Mock service base class for testing
export class MockServiceBase {
  protected logOperation = () => {};
  protected logError = () => {};
}

// Base test utilities
export const testHelpers = {
  createMockResponse,
  createMockAuthenticatedRequest,
  MockServiceBase,
};

// Common test data
export const testData = {
  validTenantId: "test-tenant-123",
  validUserId: "test-user-456",
  validTicketId: "test-ticket-789",
  validCustomerId: "test-customer-012",
};