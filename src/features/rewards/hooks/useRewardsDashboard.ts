import { useQuery } from "@tanstack/react-query";
import { rewardsService } from "../services";

export function useRewardsDashboard() {
  return useQuery({
    queryKey: ["rewards-dashboard"],
    queryFn: () => rewardsService.getDashboard(),
  });
}