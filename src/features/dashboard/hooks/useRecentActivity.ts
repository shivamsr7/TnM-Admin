import { useQuery } from "@tanstack/react-query";
import {dashboardService} from "../services/dashboard.service";

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => dashboardService.getRecentActivity(),
    staleTime: 60_000,
  });
}