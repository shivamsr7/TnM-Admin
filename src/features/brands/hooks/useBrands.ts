import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { brandService } from "../services/brand.service";
import type { BrandFormData } from "../types/brand.types";

const QUERY_KEY = ["brands"];

export function useBrands() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: brandService.getAll,
  });
}

export function useBrand(id?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => brandService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BrandFormData) =>
      brandService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: BrandFormData;
    }) => brandService.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      brandService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}