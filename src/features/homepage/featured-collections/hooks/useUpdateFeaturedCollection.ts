import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { featuredCollectionsService } from "../services/featuredCollections.service";

export function useUpdateFeaturedCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: {
        collection_id: string;
        display_order: number;
        is_active: boolean;
      };
    }) =>
      featuredCollectionsService.update(id, values),

    onSuccess: () => {
      toast.success("Featured collection updated.");

      queryClient.invalidateQueries({
        queryKey: ["featured-collections"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}