import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { collectionService } from "../services/collection.service";
import type { CollectionFormData } from "../types/collection.types";

const QUERY_KEY = ["collections"];

// Get All Collections
export function useCollections() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => collectionService.getAll(),
  });
}

// Get Single Collection
export function useCollection(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => collectionService.getById(id),
    enabled: !!id,
  });
}

// Create Collection
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CollectionFormData) =>
      collectionService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Collection created successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Update Collection
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CollectionFormData;
    }) =>
      collectionService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Collection updated successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Delete Collection
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      collectionService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Collection deleted successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}