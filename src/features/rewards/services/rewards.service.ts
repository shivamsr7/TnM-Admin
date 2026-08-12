import { supabase } from "@/lib/supabase";
import type {
  CustomerRewards,
  RewardRule,
  RewardTier,
  RewardTransaction,
} from "../types";

class RewardsService {
  // ==========================
  // Customer Rewards
  // ==========================

async getCustomerRewards(
  customerId?: string
): Promise<CustomerRewards[]> {

  let query = supabase
    .from("customer_rewards")
    .select(`
      *,
      customer:customers(
        id,
        first_name,
        last_name,
        email,
        phone
      ),
      tier:reward_tiers(
        id,
        tier_name,
        multiplier,
        badge_color
      )
    `)
    .order("created_at", {
      ascending: false,
    });



  if (customerId) {

    query = query.eq(
      "customer_id",
      customerId
    );

  }



  const {
    data,
    error,
  } = await query;



  if (error) throw error;



  return data ?? [];

}
async addPoints(
  customerId: string,
  points: number,
  description: string,
  orderId?: string,
  createdBy?: string,
  transactionType:
    | "manual_add"
    | "earn"
    | "bonus"
    | "referral" = "manual_add"
) {
  const { error } = await supabase.rpc(
    "add_reward_points",
    {
      p_customer_id: customerId,
      p_points: points,
      p_description: description,
      p_transaction_type: transactionType,
      p_order_id: orderId ?? null,
      p_created_by: createdBy ?? null,
    }
  );

  if (error) throw error;

await this.updateCustomerTier(
  customerId
);
}

async deductPoints(
  customerId: string,
  points: number,
  description: string,
  orderId?: string,
  createdBy?: string
) {
  const { error } = await supabase.rpc(
    "deduct_reward_points",
    {
      p_customer_id: customerId,
      p_points: points,
      p_description: description,
      p_transaction_type: "manual_deduct",
      p_order_id: orderId ?? null,
      p_created_by: createdBy ?? null,
    }
  );

  if (error) throw error;
  await this.updateCustomerTier(
  customerId
);
}

async getCustomerReward(
  customerId: string
): Promise<CustomerRewards> {
  const { data, error } = await supabase
    .from("customer_rewards")
    .select(`
      *,
      customer:customers(
        id,
        first_name,
        last_name,
        email,
        phone
      ),
      tier:reward_tiers(
        id,
        tier_name,
        multiplier,
        badge_color
      )
    `)
    .eq("customer_id", customerId)
    .single();

  if (error) throw error;

  return data;
}

  // ==========================
  // Reward Transactions
  // ==========================

  async getRewardTransactions(customerId: string) {
    const { data, error } = await supabase
      .from("reward_transactions")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as RewardTransaction[];
  }

 // ==========================
// Reward Rules
// ==========================

async getRewardRules() {
  const { data, error } = await supabase
    .from("reward_rules")
    .select("*")
    .single();

  if (error) throw error;

  return data as RewardRule;
}

// ==========================
// Update Reward Rules
// ==========================

async updateRewardRules(
  id: string,
  payload: Partial<RewardRule>
) {

const {
data,
error,
}=await supabase
.from("reward_rules")
.update({
  ...payload,
  updated_at:new Date().toISOString(),
})
.eq("id",id)
.select()
.single();


console.log("UPDATED DATA:", data);
console.log("UPDATE ERROR:", error);


if(error) throw error;


return data as RewardRule;

}
  // ==========================
  // Reward Tiers
  // ==========================

  async getRewardTiers() {
    const { data, error } = await supabase
      .from("reward_tiers")
      .select("*")
      .order("minimum_spend");

    if (error) throw error;

    return data as RewardTier[];
  }

// ==========================
// Create Reward Tier
// ==========================

async createRewardTier(
  payload: Omit<
    RewardTier,
    "id" | "created_at" | "updated_at"
  >
) {
  const { data, error } = await supabase
    .from("reward_tiers")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data as RewardTier;
}

// ==========================
// Update Reward Tier
// ==========================

async updateRewardTier(
  id: string,
  payload: Partial<RewardTier>
) {
  const { data, error } = await supabase
    .from("reward_tiers")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as RewardTier;
}

// ==========================
// Delete Reward Tier
// ==========================

async deleteRewardTier(id: string) {
  const { error } = await supabase
    .from("reward_tiers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

  async getDashboard() {
  const [
    rewardWallets,
    transactions,
    tiers,
  ] = await Promise.all([
    supabase
      .from("customer_rewards")
      .select("*"),

    supabase
      .from("reward_transactions")
      .select("*"),

    supabase
      .from("reward_tiers")
      .select("*"),
  ]);

  if (rewardWallets.error) throw rewardWallets.error;
  if (transactions.error) throw transactions.error;
  if (tiers.error) throw tiers.error;

  const wallets = rewardWallets.data ?? [];
  const txns = transactions.data ?? [];

 const outstandingPoints = wallets.reduce(
  (sum, wallet) => sum + wallet.current_points,
  0
);

const lifetimePoints = wallets.reduce(
  (sum, wallet) => sum + wallet.lifetime_earned,
  0
);

const redeemedPoints = wallets.reduce(
  (sum, wallet) => sum + wallet.lifetime_redeemed,
  0
);

const activeMembers = wallets.filter(
  (wallet) => wallet.current_points > 0
).length;

  return {
    outstandingPoints,
    lifetimePoints,
    redeemedPoints,
    activeMembers,
    recentTransactions: txns.slice(0, 10),
    tiers: tiers.data ?? [],
  };
}

async processOrderReward(orderId: string) {
  // Load reward rules
  const rules = await this.getRewardRules();

  // Rewards disabled
  if (!rules.rewards_enabled) return;

  // Load order
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) throw error;

  // Guest checkout
  if (!order.customer_id) return;

  // Prevent duplicate rewards
  const { data: existingReward, error: rewardError } =
    await supabase
      .from("reward_transactions")
      .select("id")
      .eq("order_id", order.id)
      .eq("transaction_type", "earn")
      .maybeSingle();

  if (rewardError) throw rewardError;

  if (existingReward) return;

  // Calculate reward points
  const points =
    Math.floor(
      order.total_amount / rules.spend_amount
    ) * rules.earn_points;

  if (points <= 0) return;

  // Award rewards (atomic database transaction)
 const { error: rpcError } = await supabase.rpc(
  "process_order_reward",
  {
    p_customer_id: order.customer_id,
    p_order_id: order.id,
    p_points: points,
    p_description:
      `Reward points earned for Order #${order.order_number}`,
  }
);

  if (rpcError) throw rpcError;

  // Upgrade customer tier if eligible
  await this.updateCustomerTier(
    order.customer_id
  );
}
private async updateCustomerTier(
  customerId: string
) {
  // Load customer wallet
  const wallet = await this.getCustomerReward(
    customerId
  );

  // Load active tiers
  const tiers = (
    await this.getRewardTiers()
  )
    .filter((tier) => tier.is_active)
    .sort(
      (a, b) =>
        b.minimum_spend - a.minimum_spend
    );

  // Highest eligible tier
  const matchedTier = tiers.find(
    (tier) =>
      wallet.lifetime_spend >=
      tier.minimum_spend
  );

  if (!matchedTier) return;

  // Already assigned
  if (wallet.tier_id === matchedTier.id)
    return;

  const { error } = await supabase
    .from("customer_rewards")
    .update({
      tier_id: matchedTier.id,
      updated_at: new Date().toISOString(),
    })
    .eq("customer_id", customerId);

  if (error) throw error;
}

async reverseOrderReward(
  orderId: string,
  type: "returned" | "refunded"
) {
  // Load reward rules
  const rules = await this.getRewardRules();

  // Rewards reversal disabled
  if (!rules.reverse_points) return;

  // Respect reward rule settings
  if (
    type === "returned" &&
    rules.ignore_returned
  ) {
    return;
  }

  if (
    type === "refunded" &&
    rules.ignore_refunded
  ) {
    return;
  }

  // Load order
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) throw error;

  // Guest checkout
  if (!order.customer_id) return;

  // Find original reward transaction
  const {
    data: rewardTransaction,
    error: rewardError,
  } = await supabase
    .from("reward_transactions")
    .select("*")
    .eq("order_id", order.id)
    .eq("transaction_type", "earn")
    .maybeSingle();

  if (rewardError) throw rewardError;

  // Rewards were never awarded
  if (!rewardTransaction) return;

  // Prevent duplicate reversal
  const {
    data: existingReverse,
    error: existingError,
  } = await supabase
    .from("reward_transactions")
    .select("id")
    .eq("order_id", order.id)
    .eq("transaction_type", type)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existingReverse) return;

  // Reverse rewards
  const { error: rpcError } = await supabase.rpc(
    "reverse_order_rewards",
    {
      p_customer_id: order.customer_id,
      p_order_id: order.id,
      p_order_amount: order.total_amount,
      p_points: rewardTransaction.points,
      p_transaction_type: type,
      p_description: `${type} - Order #${order.order_number}`,
    }
  );

  if (rpcError) throw rpcError;

  // Recalculate customer tier
  await this.updateCustomerTier(
    order.customer_id
  );
}
}

export const rewardsService = new RewardsService();


