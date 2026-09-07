import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  walletService,
  type Wallet,
  type WalletTransaction,
} from "../services/wallet.service";

export const adminWalletKeys = {
  all: ["admin-wallet"] as const,

  wallet: (customerId: string) =>
    [...adminWalletKeys.all, "wallet", customerId] as const,

  transactions: (customerId: string) =>
    [...adminWalletKeys.all, "transactions", customerId] as const,
};


/* =========================================================
   GET CUSTOMER WALLET
========================================================= */

export function useAdminCustomerWallet(
  customerId?: string
) {
  return useQuery<Wallet>({
    queryKey: customerId
      ? adminWalletKeys.wallet(customerId)
      : ["admin-wallet", "wallet", "disabled"],

    queryFn: () =>
      walletService.getCustomerWallet(customerId!),

    enabled: Boolean(customerId),

    staleTime: 30_000,
  });
}


/* =========================================================
   GET TRANSACTIONS
========================================================= */

export function useAdminWalletTransactions(
  customerId?: string
) {
  return useQuery<WalletTransaction[]>({
    queryKey: customerId
      ? adminWalletKeys.transactions(customerId)
      : ["admin-wallet", "transactions", "disabled"],

    queryFn: () =>
      walletService.getCustomerTransactions(customerId!),

    enabled: Boolean(customerId),

    staleTime: 30_000,
  });
}


/* =========================================================
   ADD CREDIT
========================================================= */

export function useAddWalletCredit(
  customerId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      amount,
      reason,
      expiresAt,
    }: {
      amount: number;
      reason: string;
      expiresAt?: string | null;
    }) =>
      walletService.addCredit(
        customerId,
        amount,
        reason,
        expiresAt
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletKeys.wallet(customerId),
      });

      queryClient.invalidateQueries({
        queryKey: adminWalletKeys.transactions(customerId),
      });
    },
  });
}


/* =========================================================
   DEDUCT CREDIT
========================================================= */

export function useDeductWalletCredit(
  customerId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      amount,
      reason,
    }: {
      amount: number;
      reason: string;
    }) =>
      walletService.deductCredit(
        customerId,
        amount,
        reason
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletKeys.wallet(customerId),
      });

      queryClient.invalidateQueries({
        queryKey: adminWalletKeys.transactions(customerId),
      });
    },
  });
}