import { useQuery } from "@tanstack/react-query";
import { rewardsService } from "../services/rewards.service";

export function useRewardTransactions(customerId?: string) {
  return useQuery({
    queryKey: ["reward-transactions", customerId],
    queryFn: () => rewardsService.getRewardTransactions(customerId!),
    enabled: !!customerId,
    staleTime: 1000 * 60,
  });
}