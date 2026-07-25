import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { homepageService } from "../services/homepage.service";
import type { BannerFormValues } from "../schemas/banner.schema";

interface UpdateBannerPayload {
  id: string;
  values: BannerFormValues;
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: UpdateBannerPayload) =>
      homepageService.updateBanner(id, values),

    onSuccess: () => {
      toast.success("Banner updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["homepage-banners"],
      });
    },

    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update banner."
      );
    },
  });
}