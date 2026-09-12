import { supabase } from "@/lib/supabase";

export interface WalletCreditLot {
  id: string;
  wallet_id: string;
  source_transaction_id: string | null;
  original_amount_paise: number;
  remaining_amount_paise: number;
  expires_at: string | null;
  status: "active" | "exhausted" | "expired";
  created_at: string;
  updated_at: string;
  source_transaction_type: string | null;
  source_description: string | null;
}

class WalletCreditLotsService {
  async getCustomerCreditLots(
    customerId: string
  ): Promise<WalletCreditLot[]> {
    const { data, error } = await supabase.rpc(
      "admin_get_customer_wallet_credit_lots",
      {
        p_customer_id: customerId,
      }
    );

    if (error) {
      throw error;
    }

    return (data ?? []) as WalletCreditLot[];
  }
}

export const walletCreditLotsService =
  new WalletCreditLotsService();
