import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { homepageService } from "../services/homepage.service";

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => homepageService.deleteBanner(id),

    onSuccess: () => {
      toast.success("Banner deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["homepage-banners"],
      });
    },

    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete banner."
      );
    },
  });
}