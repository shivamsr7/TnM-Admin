import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  reviewService,
} from "../services/review.service";

import type {
  ReviewStatus,
} from "../types/review.types";

import type {
  ReviewRewardType,
} from "../services/review.service";


export function useUpdateReviewStatus() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      id,
      status,
      rewardType,
    }: {
      id: string;
      status: ReviewStatus;
      rewardType?: ReviewRewardType;
    }) =>
      reviewService.updateStatus(
        id,
        status,
        rewardType
      ),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["review-stats"],
      });

      toast.success(
        "Review updated successfully."
      );

    },


    onError: (
      error: Error
    ) => {

      toast.error(
        error.message
      );

    },

  });
}


export function useDeleteReview() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: (
      id: string
    ) =>
      reviewService.delete(
        id
      ),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["review-stats"],
      });

      toast.success(
        "Review deleted successfully."
      );

    },


    onError: (
      error: Error
    ) => {

      toast.error(
        error.message
      );

    },

  });
}