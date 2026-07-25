import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { homepageService } from "../services/homepage.service";

interface ToggleBannerStatusPayload {
  id: string;
  isActive: boolean;
}

export function useToggleBannerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: ToggleBannerStatusPayload) =>
      homepageService.toggleBannerStatus(id, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homepage-banners"],
      });

      toast.success("Banner status updated.");
    },

    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update banner status."
      );
    },
  });
}