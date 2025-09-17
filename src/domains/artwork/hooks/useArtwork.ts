import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { artworkService } from "../services/artwork.service";
import { Artwork, ArtworkFilters } from "../types";
import { QueryOptions, ServiceListResponse, ServiceResponse } from "@/shared/services/supabase.service";

export const useArtwork = (
  filters?: ArtworkFilters,
  options?: QueryOptions,
  queryOptions?: UseQueryOptions<ServiceListResponse<Artwork>>
) => {
  return useQuery({
    queryKey: ["artwork", filters, options],
    queryFn: () => artworkService.getAll(filters, options),
    ...queryOptions,
  });
};

export const useArtworkById = (
  id: string,
  queryOptions?: UseQueryOptions<ServiceResponse<Artwork>>
) => {
  return useQuery({
    queryKey: ["artwork", id],
    queryFn: () => artworkService.getById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

export const useFeaturedArtwork = (
  limit = 6,
  queryOptions?: UseQueryOptions<ServiceListResponse<Artwork>>
) => {
  return useQuery({
    queryKey: ["artwork", "featured", limit],
    queryFn: () => artworkService.getFeatured(limit),
    ...queryOptions,
  });
};