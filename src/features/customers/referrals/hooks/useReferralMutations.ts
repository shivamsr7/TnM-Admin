import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { referralService } from "../services/referral.service";

import type {
  ReferralFormData,
} from "../types/referral.types";



export function useCreateReferral() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: ReferralFormData;
    }) =>
      referralService.create(
        customerId,
        data
      ),


    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({

        queryKey: [
          "customer-referral",
          variables.customerId,
        ],

      });


      toast.success(
        "Referral profile created."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });

}





export function useUpdateReferral() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      id,
      data,
      
    }: {
      id: string;
      data: ReferralFormData;
      customerId: string;
    }) =>
      referralService.update(
        id,
        data
      ),


    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({

        queryKey: [
          "customer-referral",
          variables.customerId,
        ],

      });


      toast.success(
        "Referral updated."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });

}