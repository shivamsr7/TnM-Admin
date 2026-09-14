import { supabase } from "@/lib/supabase";
import { customerService } from "@/features/customers/services/customer.service";

export interface PlayEarnWallet {
  id: string;
  customer_id: string;
  balance_paise: number;
  currency: string;
  status: "active" | "blocked";
  created_at: string;
  updated_at: string;
}

export interface PlayEarnWalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: "credit" | "debit" | "expiry" | "admin_adjustment";
  amount_paise: number;
  balance_before_paise: number;
  balance_after_paise: number;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface PlayEarnWalletCreditLot {
  id: string;
  wallet_id: string;
  source_transaction_id: string | null;
  original_amount_paise: number;
  remaining_amount_paise: number;
  expires_at: string | null;
  status: "active" | "exhausted" | "expired";
  created_at: string;
  updated_at: string;
  transaction_type: string | null;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
}

class PlayEarnWalletAdminService {
  async getCustomers() {
    return customerService.getAll();
  }

  async getWallet(customerId: string): Promise<PlayEarnWallet> {
    const { data, error } = await supabase.rpc(
      "admin_get_play_earn_customer_wallet",
      { p_customer_id: customerId }
    );

    if (error) throw error;
    return (Array.isArray(data) ? data[0] : data) as PlayEarnWallet;
  }

  async getWallets(customerIds: string[]) {
    const entries = await Promise.all(
      customerIds.map(async (customerId) => {
        try {
          return [customerId, await this.getWallet(customerId)] as const;
        } catch {
          return [customerId, null] as const;
        }
      })
    );

    return Object.fromEntries(entries) as Record<
      string,
      PlayEarnWallet | null
    >;
  }

  async getTransactions(
    customerId: string
  ): Promise<PlayEarnWalletTransaction[]> {
    const { data, error } = await supabase.rpc(
      "admin_get_play_earn_wallet_transactions",
      { p_customer_id: customerId }
    );

    if (error) throw error;
    return (data ?? []) as PlayEarnWalletTransaction[];
  }

  async getCreditLots(
    customerId: string
  ): Promise<PlayEarnWalletCreditLot[]> {
    const { data, error } = await supabase.rpc(
      "admin_get_play_earn_wallet_credit_lots",
      { p_customer_id: customerId }
    );

    if (error) throw error;
    return (data ?? []) as PlayEarnWalletCreditLot[];
  }

  async creditWallet(
    customerId: string,
    amountRupees: number,
    reason: string,
    expiresAt?: string | null
  ): Promise<PlayEarnWallet> {
    if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
      throw new Error("Credit amount must be greater than zero.");
    }

    const { data, error } = await supabase.rpc(
      "admin_credit_play_earn_wallet",
      {
        p_customer_id: customerId,
        p_amount_paise: Math.round(amountRupees * 100),
        p_reason: reason.trim(),
        p_expires_at: expiresAt || null,
      }
    );

    if (error) throw error;
    return (Array.isArray(data) ? data[0] : data) as PlayEarnWallet;
  }

  async setStatus(
    customerId: string,
    status: "active" | "blocked"
  ): Promise<PlayEarnWallet> {
    const { data, error } = await supabase.rpc(
      "admin_set_play_earn_wallet_status",
      {
        p_customer_id: customerId,
        p_status: status,
      }
    );

    if (error) throw error;
    return (Array.isArray(data) ? data[0] : data) as PlayEarnWallet;
  }
}

export const playEarnWalletAdminService =
  new PlayEarnWalletAdminService();
