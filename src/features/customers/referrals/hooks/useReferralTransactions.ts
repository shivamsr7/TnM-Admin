import {
  useQuery,
} from "@tanstack/react-query";


import {
  referralTransactionService,
} from "../services/referral-transaction.service";



export function useReferralTransactions(
  customerId: string
) {


  return useQuery({

    queryKey: [
      "referral-transactions",
      customerId,
    ],


    queryFn: () =>
      referralTransactionService.getByReferrer(
        customerId
      ),


    enabled: !!customerId,

  });


}