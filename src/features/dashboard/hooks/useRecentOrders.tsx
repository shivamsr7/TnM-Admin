import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export function useRecentOrders() {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => dashboardService.getRecentOrders(),
    staleTime: 1000 * 60 * 2,
  });
}