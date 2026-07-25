import { useQuery } from "@tanstack/react-query";

import { reviewService } from "../services/review.service";

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewService.getAll(),
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => reviewService.getById(id),
    enabled: !!id,
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: ["review-stats"],
    queryFn: () => reviewService.getStats(),
  });
}