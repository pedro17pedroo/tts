import { storage } from "../storage";
import type { IStorage } from "../storage";
import type { BaseRepositoryInterface, PaginationParams } from "../shared/base-types";

export abstract class BaseRepository implements BaseRepositoryInterface {
  protected storage: IStorage;

  constructor() {
    this.storage = storage;
  }

  // Common query helpers
  protected buildWhereClause(filters: Record<string, any>): string {
    const conditions = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, _]) => `${key} = $${key}`);
    
    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }

  protected buildPaginationClause(pagination?: PaginationParams): string {
    if (!pagination) return '';
    
    const { limit, offset } = pagination;
    let clause = '';
    
    if (limit) {
      clause += ` LIMIT ${limit}`;
    }
    
    if (offset) {
      clause += ` OFFSET ${offset}`;
    }
    
    return clause;
  }

  protected logQuery(operation: string, query?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.constructor.name}] ${operation}`, query || '');
    }
  }

  protected logError(operation: string, error: any): void {
    console.error(`[${this.constructor.name}] Error in ${operation}:`, error);
  }

  // Helper for safe database operations with error handling
  protected async withErrorHandling<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    try {
      this.logQuery(`Starting ${operation}`);
      const result = await fn();
      this.logQuery(`Completed ${operation}`);
      return result;
    } catch (error) {
      this.logError(operation, error);
      throw error;
    }
  }
}

export { storage };