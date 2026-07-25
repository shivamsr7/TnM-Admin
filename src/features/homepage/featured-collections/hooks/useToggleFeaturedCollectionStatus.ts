import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { featuredCollectionsService } from "../services/featuredCollections.service";

export function useToggleFeaturedCollectionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) =>
      featuredCollectionsService.toggleStatus(
        id,
        is_active
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["featured-collections"],
      });

      toast.success("Status updated.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}