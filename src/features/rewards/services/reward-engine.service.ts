import { supabase } from "@/lib/supabase";
import { rewardsService } from "./rewards.service";
import { rewardWalletService } from "./reward-wallet.service";
import { rewardTransactionService } from "./reward-transaction.service";

export class RewardEngine {
  /**
   * Calculate reward points from order amount.
   */
  async calculateEarnPoints(orderAmount: number) {
    const rules = await rewardsService.getRewardRules();

    if (!rules.rewards_enabled) {
      return 0;
    }

    return (
      Math.floor(orderAmount / rules.spend_amount) *
      rules.earn_points
    );
  }

  /**
   * Calculate customer tier from lifetime spend.
   */
  async calculateTier(totalSpent: number) {
    const tiers = await rewardsService.getRewardTiers();

    if (!tiers.length) {
      throw new Error("No reward tiers configured.");
    }

    let currentTier = tiers[0];

    for (const tier of tiers) {
      if (totalSpent >= tier.minimum_spend) {
        currentTier = tier;
      }
    }

    return currentTier;
  }

  /**
   * Award reward points after an order.
   */
  async awardPoints(
    customerId: string,
    orderId: string,
    orderAmount: number
  ) {
    const points = await this.calculateEarnPoints(orderAmount);

    if (points <= 0) return null;

    const { data, error } = await supabase.rpc(
      "award_reward_points",
      {
        p_customer_id: customerId,
        p_order_id: orderId,
        p_points: points,
        p_description: "Reward for order",
      }
    );

    if (error) throw error;

    return data;
  }

  /**
   * Redeem customer reward points.
   */
  async redeemPoints(
    customerId: string,
    points: number,
    description = "Reward Redemption"
  ) {
    const rules = await rewardsService.getRewardRules();

    if (!rules.redemption_enabled) {
      throw new Error("Reward redemption is disabled.");
    }

    const wallet =
      await rewardWalletService.ensureWallet(customerId);

    if (wallet.available_points < points) {
      throw new Error("Insufficient reward points.");
    }

    if (points < rules.minimum_redeem_points) {
      throw new Error(
        `Minimum redemption is ${rules.minimum_redeem_points} points.`
      );
    }

    await rewardTransactionService.create({
      customer_id: customerId,
      transaction_type: "redeem",
      points: -points,
      description,
    });

    return rewardWalletService.updateWallet(customerId, {
      available_points:
        wallet.available_points - points,

      redeemed_points:
        wallet.redeemed_points + points,
    });
  }

  /**
   * Manually add reward points.
   */
  async manualAddPoints(
    customerId: string,
    points: number,
    description = "Manual Reward Adjustment"
  ) {
    const wallet =
      await rewardWalletService.ensureWallet(customerId);

    await rewardTransactionService.create({
      customer_id: customerId,
      transaction_type: "manual_add",
      points,
      description,
    });

    return rewardWalletService.updateWallet(customerId, {
      available_points:
        wallet.available_points + points,

      lifetime_points:
        wallet.lifetime_points + points,
    });
  }

  /**
   * Manually deduct reward points.
   */
  async manualDeductPoints(
    customerId: string,
    points: number,
    description = "Manual Reward Deduction"
  ) {
    const wallet =
      await rewardWalletService.ensureWallet(customerId);

    if (wallet.available_points < points) {
      throw new Error(
        "Customer does not have enough reward points."
      );
    }

    await rewardTransactionService.create({
      customer_id: customerId,
      transaction_type: "manual_deduct",
      points: -points,
      description,
    });

    return rewardWalletService.updateWallet(customerId, {
      available_points:
        wallet.available_points - points,
    });
  }

  /**
   * Update customer's tier.
   */
  async recalculateTier(
    customerId: string,
    lifetimeSpend: number
  ) {
    const tier =
      await this.calculateTier(lifetimeSpend);

    return rewardWalletService.updateWallet(customerId, {
      tier: tier.tier_name,
    });
  }

  /**
   * Recalculate reward wallet totals from transaction history.
   */
  async recalculateCustomerRewards(
    customerId: string
  ) {
    const transactions =
      await rewardTransactionService.getCustomerTransactions(
        customerId
      );

    const availablePoints = transactions.reduce(
      (sum, transaction) => sum + transaction.points,
      0
    );

    const lifetimePoints = transactions
      .filter((transaction) => transaction.points > 0)
      .reduce(
        (sum, transaction) => sum + transaction.points,
        0
      );

    const redeemedPoints = Math.abs(
      transactions
        .filter(
          (transaction) =>
            transaction.transaction_type === "redeem"
        )
        .reduce(
          (sum, transaction) => sum + transaction.points,
          0
        )
    );

    return rewardWalletService.updateWallet(customerId, {
      available_points: availablePoints,
      lifetime_points: lifetimePoints,
      redeemed_points: redeemedPoints,
    });
  }
}

export const rewardEngine = new RewardEngine();