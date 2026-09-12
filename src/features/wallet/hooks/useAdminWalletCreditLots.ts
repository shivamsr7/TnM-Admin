import { useQuery } from "@tanstack/react-query";

import {
  walletCreditLotsService,
  type WalletCreditLot,
} from "../services/walletCreditLots.service";

export const adminWalletCreditLotKeys = {
  all: ["admin-wallet-credit-lots"] as const,
  customer: (customerId: string) =>
    [...adminWalletCreditLotKeys.all, customerId] as const,
};

export function useAdminWalletCreditLots(
  customerId?: string
) {
  return useQuery<WalletCreditLot[]>({
    queryKey: customerId
      ? adminWalletCreditLotKeys.customer(customerId)
      : [...adminWalletCreditLotKeys.all, "disabled"],
    queryFn: () =>
      walletCreditLotsService.getCustomerCreditLots(
        customerId!
      ),
    enabled: Boolean(customerId),
    staleTime: 30_000,
  });
}
