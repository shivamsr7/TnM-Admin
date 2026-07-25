import { useQuery } from "@tanstack/react-query";

import { addressService } from "../services/address.service";


export function useCustomerAddresses(
  customerId: string
) {

  return useQuery({

    queryKey: [
      "customer-addresses",
      customerId,
    ],


    queryFn: () =>
      addressService.getByCustomer(
        customerId
      ),


    enabled: !!customerId,

  });

}