import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { rewardsService } from "../services/rewards.service";
import type { RewardTier } from "../types";

export function useRewardTiers() {
  return useQuery({
    queryKey: ["reward-tiers"],
    queryFn: () => rewardsService.getRewardTiers(),
    staleTime: Infinity,
  });
}

export function useCreateRewardTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Omit<
        RewardTier,
        "id" | "created_at" | "updated_at"
      >
    ) => rewardsService.createRewardTier(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reward-tiers"],
      });
    },
  });
}

export function useUpdateRewardTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<RewardTier>;
    }) =>
      rewardsService.updateRewardTier(
        id,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reward-tiers"],
      });
    },
  });
}

export function useDeleteRewardTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      rewardsService.deleteRewardTier(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reward-tiers"],
      });
    },
  });
}