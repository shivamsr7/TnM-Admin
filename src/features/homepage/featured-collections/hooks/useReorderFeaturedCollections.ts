import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { featuredCollectionsService } from "../services/featuredCollections.service";

export function useReorderFeaturedCollections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: featuredCollectionsService.reorder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["featured-collections"],
      });

      toast.success("Order updated.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}