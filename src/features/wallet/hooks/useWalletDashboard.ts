import { useQuery } from "@tanstack/react-query";

import { walletDashboardService } from "../services/walletDashboard.service";

export const walletDashboardKeys = {
  all: ["admin-wallet-dashboard"] as const,
  stats: () => [...walletDashboardKeys.all, "stats"] as const,
  activity: () => [...walletDashboardKeys.all, "activity"] as const,
};

export function useWalletDashboardStats() {
  return useQuery({
    queryKey: walletDashboardKeys.stats(),
    queryFn: () => walletDashboardService.getStats(),
    staleTime: 30_000,
  });
}

export function useWalletDashboardActivity() {
  return useQuery({
    queryKey: walletDashboardKeys.activity(),
    queryFn: () => walletDashboardService.getRecentActivity(),
    staleTime: 30_000,
  });
}
