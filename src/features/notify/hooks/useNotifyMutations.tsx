import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {notifyService}  from "../services/notify.service";

export function useUpdateNotifyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status:
        | "pending"
        | "notified"
        | "purchased"
        | "cancelled";
    }) =>
      notifyService.updateStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notify"],
      });

      toast.success("Notify request updated.");
    },

    onError: () => {
      toast.error("Failed to update notify request.");
    },
  });
}