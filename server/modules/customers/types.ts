import { type Request } from "express";
import type { Customer, InsertCustomer } from "@shared/schema";

export type CustomerData = Customer;
export type CreateCustomerData = InsertCustomer;

// Request types
export interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_image_url: string;
    };
  };
}

// Response types
export interface CustomerResponse {
  customers: CustomerData[];
}

export interface SingleCustomerResponse {
  customer: CustomerData;
}