import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { tagService } from "../services/tag.service";
import type { TagFormValues } from "../types/tag.types";

const QUERY_KEY = ["tags"];

// ---------------- Get All ----------------

export function useTags() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: tagService.getAll,
  });
}

// ---------------- Get One ----------------

export function useTag(id?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => tagService.getById(id!),
    enabled: !!id,
  });
}

// ---------------- Create ----------------

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: TagFormValues) =>
      tagService.create(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Tag created successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ---------------- Update ----------------

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: TagFormValues;
    }) => tagService.update(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Tag updated successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ---------------- Delete ----------------

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      tagService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Tag deleted successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}