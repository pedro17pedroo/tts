import type { Customer, InsertCustomer } from "@shared/schema";
import type { 
  AuthenticatedRequest, 
  ApiResponse, 
  SuccessResponse,
  ErrorResponse
} from "../../shared/base-types";

export type CustomerData = Customer;
export type CreateCustomerData = InsertCustomer;

// Re-export AuthenticatedRequest from base types
export type { AuthenticatedRequest };

// Success response types
export interface CustomersSuccessResponse extends SuccessResponse<CustomerData[]> {
  success: true;
  data: CustomerData[];
}

export interface SingleCustomerSuccessResponse extends SuccessResponse<CustomerData> {
  success: true;
  data: CustomerData;
}

// API Response types (can be success or error)
export type CustomerResponse = CustomersSuccessResponse | ErrorResponse;
export type SingleCustomerResponse = SingleCustomerSuccessResponse | ErrorResponse;