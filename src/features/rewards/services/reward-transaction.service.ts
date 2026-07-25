import { supabase } from "@/lib/supabase";

interface CreateRewardTransaction {
  customer_id: string;
  order_id?: string | null;

  transaction_type:
    | "earn"
    | "redeem"
    | "bonus"
    | "birthday"
    | "referral"
    | "review"
    | "manual_add"
    | "manual_deduct"
    | "expired";

  points: number;

  description?: string;

  created_by?: string | null;
}

class RewardTransactionService {
  async create(transaction: CreateRewardTransaction) {
    const { data, error } = await supabase
      .from("reward_transactions")
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async getCustomerTransactions(customerId: string) {
    const { data, error } = await supabase
      .from("reward_transactions")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data;
  }
}

export const rewardTransactionService =
  new RewardTransactionService();