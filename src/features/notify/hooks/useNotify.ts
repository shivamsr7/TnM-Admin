import {
  useQuery,
} from "@tanstack/react-query";

import {
  notifyService,
} from "../services/notify.service";


/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 */

export const notifyKeys = {

  all: [
    "notify",
  ] as const,

  requests: [
    "notify-requests",
  ] as const,

  stats: [
    "notify-stats",
  ] as const,

  request: (
    id: string
  ) => [
    "notify-request",
    id,
  ] as const,

};


/*
 * =========================================================
 * ADMIN — ALL REQUESTS
 * =========================================================
 */

export function useNotifyRequests() {

  return useQuery({

    queryKey:
      notifyKeys.requests,

    queryFn:
      () =>
        notifyService.getAll(),

    /*
     * Data becomes stale after 30 seconds.
     */

    staleTime:
      30_000,

    /*
     * Fetch again when opening/mounting
     * the Admin page.
     */

    refetchOnMount:
      true,

    /*
     * Fetch again when returning to the
     * Admin browser tab.
     */

    refetchOnWindowFocus:
      true,

    /*
     * Keep the request list reasonably
     * fresh while Admin is open.
     */

    refetchInterval:
      30_000,

  });

}


/*
 * =========================================================
 * ADMIN — STATS
 * =========================================================
 */

export function useNotifyStats() {

  return useQuery({

    queryKey:
      notifyKeys.stats,

    queryFn:
      () =>
        notifyService.getStats(),

    staleTime:
      30_000,

    refetchOnMount:
      true,

    refetchOnWindowFocus:
      true,

    refetchInterval:
      30_000,

  });

}


/*
 * =========================================================
 * ADMIN — SINGLE REQUEST
 * =========================================================
 */

export function useNotifyRequest(
  id: string
) {

  return useQuery({

    queryKey:
      notifyKeys.request(id),

    queryFn:
      () =>
        notifyService.getById(
          id
        ),

    enabled:
      Boolean(id),

    staleTime:
      30_000,

    refetchOnMount:
      true,

    refetchOnWindowFocus:
      true,

  });

}