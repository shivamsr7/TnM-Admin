import { useQuery } from "@tanstack/react-query";

import { membershipService } from "../services/membership.service";

export function useMembers() {
  return useQuery({
    queryKey: ["membership-members"],

    queryFn: () =>
      membershipService.getMembers(),

    staleTime: Infinity,
  });
}

export function useMembershipStats() {
  return useQuery({
    queryKey: ["membership-stats"],

    queryFn: () =>
      membershipService.getMembershipStats(),

    staleTime: Infinity,
  });
}

export function useMember(customerId: string) {
  return useQuery({
    queryKey: ["membership-member", customerId],

    queryFn: () =>
      membershipService.getMember(customerId),

    enabled: !!customerId,

    staleTime: Infinity,
  });
}
export function useRewardHistory(
  customerId: string
) {
  return useQuery({
    queryKey: [
      "reward-history",
      customerId,
    ],

    queryFn: () =>
      membershipService.getRewardHistory(
        customerId
      ),

    enabled: !!customerId,

    staleTime: Infinity,
  });
}