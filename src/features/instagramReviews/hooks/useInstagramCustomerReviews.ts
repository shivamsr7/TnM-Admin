import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  instagramCustomerReviewService,
} from "../services/instagramCustomerReview.service";

import type {
  InstagramCustomerReviewFormData,
} from "../types/instagramCustomerReview.types";

export const instagramCustomerReviewKeys = {
  all: ["instagram-customer-reviews"] as const,
  published: ["instagram-customer-reviews", "published"] as const,
};

export function useInstagramCustomerReviews() {
  return useQuery({
    queryKey: instagramCustomerReviewKeys.all,
    queryFn: () => instagramCustomerReviewService.getAll(),
  });
}

export function usePublishedInstagramCustomerReviews() {
  return useQuery({
    queryKey: instagramCustomerReviewKeys.published,
    queryFn: () => instagramCustomerReviewService.getPublished(),
  });
}

export function useCreateInstagramCustomerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: InstagramCustomerReviewFormData) =>
      instagramCustomerReviewService.create(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: instagramCustomerReviewKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: instagramCustomerReviewKeys.published,
      });
    },
  });
}

export function useUpdateInstagramCustomerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<InstagramCustomerReviewFormData>;
    }) =>
      instagramCustomerReviewService.update(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: instagramCustomerReviewKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: instagramCustomerReviewKeys.published,
      });
    },
  });
}

export function useDeleteInstagramCustomerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      instagramCustomerReviewService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: instagramCustomerReviewKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: instagramCustomerReviewKeys.published,
      });
    },
  });
}