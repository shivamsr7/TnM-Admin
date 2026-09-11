import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  walletSettingsService,
  type WalletSettingsUpdate,
} from "../services/walletSettings.service";

export const walletSettingsKeys = {
  all: ["admin-wallet-settings"] as const,
};

export function useWalletSettings() {
  return useQuery({
    queryKey: walletSettingsKeys.all,
    queryFn: () =>
      walletSettingsService.getSettings(),
    staleTime: 30_000,
  });
}

export function useUpdateWalletSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: WalletSettingsUpdate) =>
      walletSettingsService.updateSettings(settings),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: walletSettingsKeys.all,
      });
    },
  });
}
