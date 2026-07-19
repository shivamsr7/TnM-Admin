import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { categoryService } from "../services/category.service";
import type { CategoryFormData } from "../types/category.types";

const QUERY_KEY = ["categories"];

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: categoryService.getAll,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryFormData) =>
      categoryService.create(data),

    onSuccess: () => {
      toast.success("Category created");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CategoryFormData;
    }) =>
      categoryService.update(id, data),

    onSuccess: () => {
      toast.success("Category updated");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.delete,

    onSuccess: () => {
      toast.success("Category deleted");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}