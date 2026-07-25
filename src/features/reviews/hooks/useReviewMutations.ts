import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reviewService } from "../services/review.service";
import type { ReviewStatus } from "../types/review.types";

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ReviewStatus;
    }) => reviewService.updateStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["review-stats"],
      });

      toast.success("Review updated successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      reviewService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["review-stats"],
      });

      toast.success("Review deleted successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}