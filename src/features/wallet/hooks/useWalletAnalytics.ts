import { useQuery } from "@tanstack/react-query";

import {
  walletAnalyticsService,
  type WalletAnalyticsPeriod,
} from "../services/walletAnalytics.service";

export const walletAnalyticsKeys = {
  all: ["admin-wallet-analytics"] as const,
  analytics: (days: WalletAnalyticsPeriod) =>
    [...walletAnalyticsKeys.all, days] as const,
};

export function useWalletAnalytics(
  days: WalletAnalyticsPeriod
) {
  return useQuery({
    queryKey: walletAnalyticsKeys.analytics(days),
    queryFn: () =>
      walletAnalyticsService.getAnalytics(days),
    staleTime: 30_000,
  });
}
