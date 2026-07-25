import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { homepageService } from "../services/homepage.service";
import type { BannerFormValues } from "../schemas/banner.schema";

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: BannerFormValues) => {
      return homepageService.createBanner(values);
    },

    onSuccess: () => {
      toast.success("Banner created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["homepage-banners"],
      });
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create banner.";

      toast.error(message);
    },
  });
}