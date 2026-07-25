import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { homepageService } from "../services/homepage.service";

export function useReorderBanners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      banners: {
        id: string;
        display_order: number;
      }[]
    ) => homepageService.reorderBanners(banners),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homepage-banners"],
      });

      toast.success("Banner order updated.");
    },

    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reorder banners."
      );
    },
  });
}