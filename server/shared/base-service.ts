import type { BaseService } from "./base-types";

export abstract class BaseModuleService implements BaseService {
  // Base service implementations that all modules can use
  
  protected logOperation(operation: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.constructor.name}] ${operation}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  protected logError(operation: string, error: any): void {
    console.error(`[${this.constructor.name}] Error in ${operation}:`, error);
  }

  // Validation helper
  protected validateRequired(data: any, fields: string[]): void {
    const missing = fields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  }

  // Async error wrapper
  protected async withErrorHandling<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    try {
      this.logOperation(`Starting ${operation}`);
      const result = await fn();
      this.logOperation(`Completed ${operation}`);
      return result;
    } catch (error) {
      this.logError(operation, error);
      throw error;
    }
  }
}