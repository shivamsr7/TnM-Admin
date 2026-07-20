import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}