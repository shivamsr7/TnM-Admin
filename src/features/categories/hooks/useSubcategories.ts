import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  subcategoryService,
  type CreateSubcategoryData,
  type UpdateSubcategoryData,
} from "../services/subcategory.service";

export function useSubcategories(categoryId?: string) {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => subcategoryService.getByCategory(categoryId!),
    enabled: !!categoryId,
  });
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubcategoryData) =>
      subcategoryService.create(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", variables.category_id],
      });
    },
  });
}

export function useUpdateSubcategory(categoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSubcategoryData;
    }) => subcategoryService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", categoryId],
      });
    },
  });
}

export function useDeleteSubcategory(categoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      subcategoryService.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", categoryId],
      });
    },
  });
}