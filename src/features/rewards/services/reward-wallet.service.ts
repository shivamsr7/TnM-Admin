import { supabase } from "@/lib/supabase";
import type { CustomerRewards } from "../types";

class RewardWalletService {
  async getWallet(customerId: string): Promise<CustomerRewards | null> {
    const { data, error } = await supabase
      .from("customer_rewards")
      .select("*")
      .eq("customer_id", customerId)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  async createWallet(customerId: string): Promise<CustomerRewards> {
  const { data, error } = await supabase
    .from("customer_rewards")
    .insert({
      customer_id: customerId,
    })
    .select()
    .single();

  if (error) throw error;

  if (!data) {
    throw new Error("Failed to create reward wallet.");
  }

  return data;
}

  async ensureWallet(customerId: string): Promise<CustomerRewards> {
  let wallet = await this.getWallet(customerId);

  if (!wallet) {
    wallet = await this.createWallet(customerId);
  }

  if (!wallet) {
    throw new Error("Failed to create reward wallet.");
  }

  return wallet;
}

  async updateWallet(
    customerId: string,
    updates: Partial<CustomerRewards>
  ) {
    const { data, error } = await supabase
      .from("customer_rewards")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("customer_id", customerId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}

export const rewardWalletService = new RewardWalletService();