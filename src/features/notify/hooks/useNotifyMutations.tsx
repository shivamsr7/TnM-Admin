import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  toast,
} from "sonner";

import {
  notifyService,
} from "../services/notify.service";

import type {
  NotifyStatus,
} from "../types/notify.types";


export function useUpdateNotifyStatus() {

  const queryClient =
    useQueryClient();


  return useMutation({

    /*
     * =======================================================
     * UPDATE STATUS
     * =======================================================
     */

    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: NotifyStatus;
    }) =>
      notifyService.updateStatus(
        id,
        status
      ),


    /*
     * =======================================================
     * SUCCESS
     * =======================================================
     */

    onSuccess: (
      _data,
      variables
    ) => {

      /*
       * Refresh the Admin request table.
       */

      queryClient.invalidateQueries({

        queryKey: [
          "notify-requests",
        ],

      });


      /*
       * Refresh Admin stats.
       */

      queryClient.invalidateQueries({

        queryKey: [
          "notify-stats",
        ],

      });


      /*
       * Refresh the individual request
       * if its detail dialog is cached.
       */

      queryClient.invalidateQueries({

        queryKey: [
          "notify-request",
          variables.id,
        ],

      });


      toast.success(
        "Notify request updated."
      );

    },


    /*
     * =======================================================
     * ERROR
     * =======================================================
     */

    onError: (
      error
    ) => {

      console.error(
        "Notify status update failed:",
        error
      );


      toast.error(
        "Failed to update notify request."
      );

    },

  });

}