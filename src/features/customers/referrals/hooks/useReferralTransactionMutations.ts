import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  referralTransactionService,
} from "../services/referral-transaction.service";

import {
  referralRewardService,
} from "../services/referral-reward.service";

import type {
  ReferralTransaction,
} from "../types/referral-transaction.types";



import {
  referralService,
} from "../services/referral.service";



export function useCompleteReferralTransaction() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: async (
      transaction: ReferralTransaction
    ) => {


      const updatedTransaction =
        await referralTransactionService.completeReferral(
          transaction.id
        );



      await referralService.updateReferralCounts(
        transaction.referrer_id
      );



      await referralRewardService.releaseReferralRewards({

        ...transaction,

        status: "completed",

        completed_at:
          new Date().toISOString(),

      });



      return updatedTransaction;

    },


    onSuccess: (_, transaction) => {


      queryClient.invalidateQueries({

        queryKey: [
          "referral-transactions",
          transaction.referrer_id,
        ],

      });



      queryClient.invalidateQueries({

        queryKey: [
          "customer-referral",
          transaction.referrer_id,
        ],

      });



      toast.success(
        "Referral completed and rewards added."
      );

    },

  });

}





export function useCancelReferralTransaction() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: (
      transactionId: string
    ) =>
      referralTransactionService.cancelReferral(
        transactionId
      ),



    onSuccess: () => {


      queryClient.invalidateQueries({

        queryKey: [
          "referral-transactions",
        ],

      });


      toast.success(
        "Referral cancelled."
      );


    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });

}