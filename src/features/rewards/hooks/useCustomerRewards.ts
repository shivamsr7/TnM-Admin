import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { rewardsService } from "../services/rewards.service";

export function useCustomerRewards() {
  return useQuery({
    queryKey: ["customer-rewards"],
    queryFn: () => rewardsService.getCustomerRewards(),
    staleTime: Infinity,
  });
}

export function useCustomerReward(customerId?: string) {
  return useQuery({
    queryKey: ["customer-reward", customerId],
    queryFn: () =>
      rewardsService.getCustomerReward(customerId!),
    enabled: !!customerId,
  });
}

export function useRewardTransactions(
  customerId?: string
) {
  return useQuery({
    queryKey: [
      "reward-transactions",
      customerId,
    ],
    queryFn: () =>
      rewardsService.getRewardTransactions(
        customerId!
      ),
    enabled: !!customerId,
  });
}

export function useAddPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      points,
      description,
      orderId,
      createdBy,
    }: {
      customerId: string;
      points: number;
      description: string;
      orderId?: string;
      createdBy?: string;
    }) =>
      rewardsService.addPoints(
        customerId,
        points,
        description,
        orderId,
        createdBy
      ),

    onSuccess: (_, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["customer-reward", variables.customerId],
  });

  queryClient.invalidateQueries({
    queryKey: ["customer-rewards"],
  });

  queryClient.invalidateQueries({
    queryKey: [
      "reward-transactions",
      variables.customerId,
    ],
  });
},
  });
}

export function useDeductPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      points,
      description,
      orderId,
      createdBy,
    }: {
      customerId: string;
      points: number;
      description: string;
      orderId?: string;
      createdBy?: string;
    }) =>
      rewardsService.deductPoints(
        customerId,
        points,
        description,
        orderId,
        createdBy
      ),

    onSuccess: (_, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["customer-reward", variables.customerId],
  });

  queryClient.invalidateQueries({
    queryKey: ["customer-rewards"],
  });

  queryClient.invalidateQueries({
    queryKey: [
      "reward-transactions",
      variables.customerId,
    ],
  });
},
  });
}