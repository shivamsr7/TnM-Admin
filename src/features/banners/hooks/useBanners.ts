import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { bannerService } from "../services/banner.service";
import type { BannerFormData } from "../types/banner.types";

const QUERY_KEY = ["banners"];

export function useBanners() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: bannerService.getAll,
  });
}

export function useBanner(id?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => bannerService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: BannerFormData) =>
      bannerService.create(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: BannerFormData;
    }) => bannerService.update(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      bannerService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}