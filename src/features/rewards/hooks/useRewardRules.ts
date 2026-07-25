import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { rewardsService } from "../services/rewards.service";
import type { RewardRule } from "../types";

const QUERY_KEY = ["reward-rules"];

export function useRewardRules() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => rewardsService.getRewardRules(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateRewardRules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<RewardRule>;
    }) =>
      rewardsService.updateRewardRules(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Reward rules updated successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}