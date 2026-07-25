import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { featuredCollectionsService } from "../services/featuredCollections.service";

export function useRemoveFeaturedCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: featuredCollectionsService.removeCollection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["featured-collections"],
      });

      toast.success(
        "Collection removed successfully."
      );
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}