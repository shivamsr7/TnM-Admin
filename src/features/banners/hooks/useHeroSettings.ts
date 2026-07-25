import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { heroSettingsService } from "../services/heroSettings.service";
import type { HeroSettingsFormData } from "../types/heroSettings.types";

const HERO_SETTINGS_QUERY_KEY = ["hero-settings"];

export function useHeroSettings() {
  return useQuery({
    queryKey: HERO_SETTINGS_QUERY_KEY,
    queryFn: () => heroSettingsService.get(),
  });
}

export function useUpdateHeroSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: HeroSettingsFormData) =>
      heroSettingsService.update(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: HERO_SETTINGS_QUERY_KEY,
      });

      toast.success("Hero settings updated successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hero settings.");
    },
  });
}