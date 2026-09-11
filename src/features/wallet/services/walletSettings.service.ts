import { supabase } from "@/lib/supabase";

export interface WalletSettings {
  id: boolean;
  enabled: boolean;
  max_balance_paise: number;
  min_order_value_paise: number;
  min_redemption_paise: number;
  max_redemption_percentage: number;
  max_redemption_per_order_paise: number;
  allow_with_coupon: boolean;
  allow_on_regular_price: boolean;
  allow_on_sale_price: boolean;
  allow_on_special_offer: boolean;
  allow_on_clearance: boolean;
  allow_cash_withdrawal: boolean;
  allow_transfer: boolean;
  refund_credit_expiry_days: number;
  cashback_expiry_days: number;
  referral_expiry_days: number;
  promotional_expiry_days: number;
  updated_at: string;
  updated_by: string | null;
}

export type WalletSettingsUpdate = Omit<
  WalletSettings,
  "id" | "updated_at" | "updated_by"
>;

class WalletSettingsService {
  async getSettings(): Promise<WalletSettings> {
    const { data, error } = await supabase.rpc(
      "admin_get_wallet_settings"
    );

    if (error) {
      throw error;
    }

    return data as WalletSettings;
  }

  async updateSettings(
    settings: WalletSettingsUpdate
  ): Promise<WalletSettings> {
    const { data, error } = await supabase.rpc(
      "admin_update_wallet_settings",
      {
        p_enabled: settings.enabled,
        p_max_balance_paise: settings.max_balance_paise,
        p_min_order_value_paise: settings.min_order_value_paise,
        p_min_redemption_paise: settings.min_redemption_paise,
        p_max_redemption_percentage:
          settings.max_redemption_percentage,
        p_max_redemption_per_order_paise:
          settings.max_redemption_per_order_paise,
        p_allow_with_coupon: settings.allow_with_coupon,
        p_allow_on_regular_price:
          settings.allow_on_regular_price,
        p_allow_on_sale_price:
          settings.allow_on_sale_price,
        p_allow_on_special_offer:
          settings.allow_on_special_offer,
        p_allow_on_clearance:
          settings.allow_on_clearance,
        p_allow_cash_withdrawal:
          settings.allow_cash_withdrawal,
        p_allow_transfer: settings.allow_transfer,
        p_refund_credit_expiry_days:
          settings.refund_credit_expiry_days,
        p_cashback_expiry_days:
          settings.cashback_expiry_days,
        p_referral_expiry_days:
          settings.referral_expiry_days,
        p_promotional_expiry_days:
          settings.promotional_expiry_days,
      }
    );

    if (error) {
      throw error;
    }

    return data as WalletSettings;
  }
}

export const walletSettingsService =
  new WalletSettingsService();
