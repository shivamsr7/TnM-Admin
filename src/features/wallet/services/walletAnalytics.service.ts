import { supabase } from "@/lib/supabase";

export type WalletAnalyticsPeriod = 7 | 30 | 90 | null;

export interface WalletAnalytics {
  credits_paise: number;
  debits_paise: number;
  refunds_paise: number;
  expired_paise: number;
}

class WalletAnalyticsService {
  async getAnalytics(
    days: WalletAnalyticsPeriod
  ): Promise<WalletAnalytics> {
    const { data, error } = await supabase.rpc(
      "admin_get_wallet_analytics",
      {
        p_days: days,
      }
    );

    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;

    if (!row) {
      throw new Error("Wallet analytics data was not returned");
    }

    return {
      credits_paise: Number(row.credits_paise ?? 0),
      debits_paise: Number(row.debits_paise ?? 0),
      refunds_paise: Number(row.refunds_paise ?? 0),
      expired_paise: Number(row.expired_paise ?? 0),
    };
  }
}

export const walletAnalyticsService =
  new WalletAnalyticsService();
