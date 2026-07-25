import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { homepageSectionsService } from "../services/homepageSections.service";

interface ToggleSectionPayload {
  id: string;
  is_enabled: boolean;
}

export function useToggleSectionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_enabled }: ToggleSectionPayload) =>
      homepageSectionsService.toggleSectionStatus(
        id,
        is_enabled
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homepage-sections"],
      });

      toast.success("Section updated.");
    },

    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update section."
      );
    },
  });
}