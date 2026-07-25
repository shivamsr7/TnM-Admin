import { useQuery } from "@tanstack/react-query";

import { referralService } from "../services/referral.service";


export function useCustomerReferral(
  customerId: string
) {

  return useQuery({

    queryKey: [
      "customer-referral",
      customerId,
    ],


    queryFn: () =>
      referralService.getByCustomer(
        customerId
      ),


    enabled: !!customerId,

  });

}



export function useReferredCustomers(
  customerId: string
) {

  return useQuery({

    queryKey: [
      "referred-customers",
      customerId,
    ],


    queryFn: () =>
      referralService.getReferredCustomers(
        customerId
      ),


    enabled: !!customerId,

  });

}