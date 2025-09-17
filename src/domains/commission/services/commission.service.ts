import SupabaseService, { ServiceListResponse, ServiceResponse, QueryOptions } from "@/shared/services/supabase.service";
import { CommissionPackage, CommissionRequest, CommissionFilters } from "../types";

class CommissionService extends SupabaseService {
  private readonly packagesTableName = "commission_packages";
  private readonly requestsTableName = "commission_requests";

  // Package methods
  async getAllPackages(filters?: CommissionFilters, options?: QueryOptions): Promise<ServiceListResponse<CommissionPackage>> {
    return this.executeListQuery(async () => {
      let query = this.getClient()
        .from(this.packagesTableName)
        .select("*");

      // Apply filters
      if (filters) {
        if (filters.category) {
          query = query.eq("category", filters.category as any);
        }
        
        if (filters.style) {
          query = query.eq("style", filters.style as any);
        }
        
        if (filters.isActive !== undefined) {
          query = query.eq("is_active", filters.isActive);
        }
        
        if (filters.priceRange) {
          if (filters.priceRange.min !== undefined) {
            query = query.gte("base_price", filters.priceRange.min);
          }
          if (filters.priceRange.max !== undefined) {
            query = query.lte("base_price", filters.priceRange.max);
          }
        }
      }

      // Apply default filters for public access
      query = query.eq("is_active", true);

      // Apply query options
      query = this.applyQueryOptions(query, options || {
        orderBy: { column: "base_price", ascending: true }
      });

      return query;
    });
  }

  async getPackageById(id: string): Promise<ServiceResponse<CommissionPackage>> {
    return this.executeQuery(async () => {
      return this.getClient()
        .from(this.packagesTableName)
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();
    });
  }

  async getActivePackages(options?: QueryOptions): Promise<ServiceListResponse<CommissionPackage>> {
    return this.getAllPackages({ isActive: true }, options);
  }

  // Request methods
  async createRequest(request: Omit<CommissionRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<CommissionRequest>> {
    return this.executeQuery(async () => {
      return this.getClient()
        .from(this.requestsTableName)
        .insert(request)
        .select()
        .single();
    });
  }

  async getRequestById(id: string): Promise<ServiceResponse<CommissionRequest>> {
    return this.executeQuery(async () => {
      return this.getClient()
        .from(this.requestsTableName)
        .select("*")
        .eq("id", id)
        .single();
    });
  }

  async getRequestsByEmail(email: string): Promise<ServiceListResponse<CommissionRequest>> {
    return this.executeListQuery(async () => {
      return this.getClient()
        .from(this.requestsTableName)
        .select("*")
        .eq("customer_email", email)
        .order("created_at", { ascending: false });
    });
  }
}

export const commissionService = new CommissionService();