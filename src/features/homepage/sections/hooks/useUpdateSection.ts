import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { homepageSectionsService } from "../services/homepageSections.service";
import type { HomepageSectionFormValues } from "../types/section.types";

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: HomepageSectionFormValues;
    }) =>
      homepageSectionsService.updateSection(
        id,
        values
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homepage-sections"],
      });

      toast.success("Section updated successfully.");
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