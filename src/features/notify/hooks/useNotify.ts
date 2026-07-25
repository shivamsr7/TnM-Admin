import { useQuery } from "@tanstack/react-query";

import { notifyService } from "../services/notify.service";

export function useNotifyRequests() {
  return useQuery({
    queryKey: ["notify-requests"],
    queryFn: () =>
      notifyService.getAll(),
    staleTime: Infinity,
  });
}

export function useNotifyStats() {
  return useQuery({
    queryKey: ["notify-stats"],
    queryFn: () =>
      notifyService.getStats(),
    staleTime: Infinity,
  });
}

export function useNotifyRequest(
  id: string
) {
  return useQuery({
    queryKey: [
      "notify-request",
      id,
    ],
    queryFn: () =>
      notifyService.getById(id),
    enabled: !!id,
  });
}