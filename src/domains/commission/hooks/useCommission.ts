import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { commissionService } from "../services/commission.service";
import { CommissionPackage, CommissionRequest, CommissionFilters } from "../types";
import { QueryOptions, ServiceListResponse, ServiceResponse } from "@/shared/services/supabase.service";

export const useCommissionPackages = (
  filters?: CommissionFilters,
  options?: QueryOptions,
  queryOptions?: UseQueryOptions<ServiceListResponse<CommissionPackage>>
) => {
  return useQuery({
    queryKey: ["commission_packages", filters, options],
    queryFn: () => commissionService.getAllPackages(filters, options),
    ...queryOptions,
  });
};

export const useCommissionPackageById = (
  id: string,
  queryOptions?: UseQueryOptions<ServiceResponse<CommissionPackage>>
) => {
  return useQuery({
    queryKey: ["commission_packages", id],
    queryFn: () => commissionService.getPackageById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

export const useActiveCommissionPackages = (
  options?: QueryOptions,
  queryOptions?: UseQueryOptions<ServiceListResponse<CommissionPackage>>
) => {
  return useQuery({
    queryKey: ["commission_packages", "active", options],
    queryFn: () => commissionService.getActivePackages(options),
    ...queryOptions,
  });
};

export const useCreateCommissionRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: Omit<CommissionRequest, 'id' | 'created_at' | 'updated_at'>) =>
      commissionService.createRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission_requests"] });
    },
  });
};

export const useCommissionRequestsByEmail = (
  email: string,
  queryOptions?: UseQueryOptions<ServiceListResponse<CommissionRequest>>
) => {
  return useQuery({
    queryKey: ["commission_requests", "email", email],
    queryFn: () => commissionService.getRequestsByEmail(email),
    enabled: !!email,
    ...queryOptions,
  });
};