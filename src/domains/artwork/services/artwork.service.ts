import SupabaseService, { ServiceListResponse, ServiceResponse, QueryOptions } from "@/shared/services/supabase.service";
import { Artwork, ArtworkFilters } from "../types";

class ArtworkService extends SupabaseService {
  private readonly tableName = "artwork";

  async getAll(filters?: ArtworkFilters, options?: QueryOptions): Promise<ServiceListResponse<Artwork>> {
    return this.executeListQuery(async () => {
      let query = this.getClient()
        .from(this.tableName)
        .select("*");

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        
        if (filters.category && filters.category !== "all") {
          query = query.eq("category", filters.category as any);
        }
        
        if (filters.style) {
          query = query.eq("style", filters.style as any);
        }
        
        if (filters.medium) {
          query = query.eq("medium", filters.medium as any);
        }
        
        if (filters.isFeatured !== undefined) {
          query = query.eq("is_featured", filters.isFeatured);
        }
        
        if (filters.isAvailable !== undefined) {
          query = query.eq("is_available", filters.isAvailable);
        }
        
        if (filters.priceRange) {
          if (filters.priceRange.min !== undefined) {
            query = query.gte("price", filters.priceRange.min);
          }
          if (filters.priceRange.max !== undefined) {
            query = query.lte("price", filters.priceRange.max);
          }
        }
      }

      // Apply default filters for public access
      query = query.eq("is_available", true);

      // Apply query options
      query = this.applyQueryOptions(query, options || {
        orderBy: { column: "created_at", ascending: false }
      });

      return query;
    });
  }

  async getById(id: string): Promise<ServiceResponse<Artwork>> {
    return this.executeQuery(async () => {
      return this.getClient()
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .eq("is_available", true)
        .single();
    });
  }

  async getFeatured(limit = 6): Promise<ServiceListResponse<Artwork>> {
    return this.executeListQuery(async () => {
      return this.getClient()
        .from(this.tableName)
        .select("*")
        .eq("is_featured", true)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(limit);
    });
  }

  async getAvailable(options?: QueryOptions): Promise<ServiceListResponse<Artwork>> {
    return this.getAll({ isAvailable: true }, options);
  }

  async getByCategory(category: string, options?: QueryOptions): Promise<ServiceListResponse<Artwork>> {
    return this.getAll({ category, isAvailable: true }, options);
  }
}

export const artworkService = new ArtworkService();