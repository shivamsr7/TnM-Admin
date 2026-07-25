import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { featuredCollectionsService } from "../services/featuredCollections.service";

export function useAddFeaturedCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      featuredCollectionsService.addCollection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["featured-collections"],
      });

      toast.success("Collection added.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}