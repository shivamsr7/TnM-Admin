import { supabase } from "@/lib/supabase";

export interface WalletDashboardStats {
  total_wallet_balance_paise: number;
  wallet_customer_count: number;
  total_credits_paise: number;
  total_debits_paise: number;
  total_refunds_paise: number;
  total_expired_paise: number;
}

export interface WalletDashboardActivity {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string | null;
  transaction_type: string;
  amount_paise: number;
  balance_after_paise: number;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  expires_at: string | null;
  created_at: string;
}

class WalletDashboardService {
  async getStats(): Promise<WalletDashboardStats> {
    const { data, error } = await supabase.rpc(
      "admin_get_wallet_dashboard"
    );

    if (error) throw error;

    // The RPC returns one row because it uses RETURNS TABLE.
    const row = Array.isArray(data) ? data[0] : data;

    if (!row) {
      throw new Error("Wallet dashboard data was not returned");
    }

    return {
      total_wallet_balance_paise: Number(
        row.total_wallet_balance_paise ?? 0
      ),
      wallet_customer_count: Number(
        row.wallet_customer_count ?? 0
      ),
      total_credits_paise: Number(
        row.total_credits_paise ?? 0
      ),
      total_debits_paise: Number(
        row.total_debits_paise ?? 0
      ),
      total_refunds_paise: Number(
        row.total_refunds_paise ?? 0
      ),
      total_expired_paise: Number(
        row.total_expired_paise ?? 0
      ),
    };
  }

  async getRecentActivity(): Promise<WalletDashboardActivity[]> {
    const { data, error } = await supabase.rpc(
      "admin_get_wallet_dashboard_activity"
    );

    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      customer_id: row.customer_id,
      customer_name: row.customer_name ?? "Customer",
      customer_email: row.customer_email ?? null,
      transaction_type: row.transaction_type,
      amount_paise: Number(row.amount_paise ?? 0),
      balance_after_paise: Number(row.balance_after_paise ?? 0),
      reference_type: row.reference_type ?? null,
      reference_id: row.reference_id ?? null,
      description: row.description ?? null,
      expires_at: row.expires_at ?? null,
      created_at: row.created_at,
    }));
  }
}

export const walletDashboardService =
  new WalletDashboardService();
