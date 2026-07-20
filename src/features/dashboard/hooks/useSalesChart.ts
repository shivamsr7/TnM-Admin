import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import type { SalesPeriod } from "../types/dashboard.types";

export function useSalesChart(period: SalesPeriod) {
  return useQuery({
    queryKey: ["sales-chart", period],
    queryFn: () => dashboardService.getSalesChart(period),
    staleTime: 1000 * 60 * 5,
  });
}