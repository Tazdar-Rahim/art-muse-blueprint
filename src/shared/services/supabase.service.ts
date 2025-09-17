import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface QueryOptions {
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface ServiceListResponse<T> {
  data: T[] | null;
  error: string | null;
  success: boolean;
  count?: number;
}

class SupabaseService {
  protected handleError(error: PostgrestError | Error | null): string {
    if (!error) return "Unknown error occurred";
    
    // Log error for debugging
    console.error("Supabase operation error:", error);
    
    if ('message' in error) {
      return error.message;
    }
    
    return "Database operation failed";
  }

  protected async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>
  ): Promise<ServiceResponse<T>> {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        return {
          data: null,
          error: this.handleError(error),
          success: false
        };
      }

      return {
        data,
        error: null,
        success: true
      };
    } catch (err) {
      return {
        data: null,
        error: this.handleError(err as Error),
        success: false
      };
    }
  }

  protected async executeListQuery<T>(
    queryFn: () => Promise<{ data: T[] | null; error: PostgrestError | null; count?: number | null }>
  ): Promise<ServiceListResponse<T>> {
    try {
      const { data, error, count } = await queryFn();
      
      if (error) {
        return {
          data: null,
          error: this.handleError(error),
          success: false
        };
      }

      return {
        data: data || [],
        error: null,
        success: true,
        count: count || undefined
      };
    } catch (err) {
      return {
        data: null,
        error: this.handleError(err as Error),
        success: false
      };
    }
  }

  protected getClient() {
    return supabase;
  }

  protected applyQueryOptions(query: any, options?: QueryOptions) {
    if (!options) return query;

    let modifiedQuery = query;

    if (options.orderBy) {
      modifiedQuery = modifiedQuery.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }

    if (options.limit) {
      modifiedQuery = modifiedQuery.limit(options.limit);
    }

    if (options.offset) {
      modifiedQuery = modifiedQuery.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return modifiedQuery;
  }
}

export default SupabaseService;