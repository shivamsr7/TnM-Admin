import { supabase } from "@/lib/supabase";

import {
  rewardsService,
} from "./rewards.service";

import {
  rewardWalletService,
} from "./reward-wallet.service";

import {
  rewardTransactionService,
} from "./reward-transaction.service";


export class RewardEngine {


  /**
   * Calculate reward points from order amount
   */
  async calculateEarnPoints(
    orderAmount: number
  ) {

    const rules =
      await rewardsService.getRewardRules();


    if (!rules.rewards_enabled) {
      return 0;
    }


    return (
      Math.floor(
        orderAmount /
        rules.spend_amount
      ) *
      rules.earn_points
    );

  }




  /**
   * Calculate customer tier
   */
  async calculateTier(
    totalSpent: number
  ) {


    const tiers =
      await rewardsService.getRewardTiers();



    const activeTiers =
      tiers
        .filter(
          (tier) =>
            tier.is_active
        )
        .sort(
          (a, b) =>
            b.minimum_spend -
            a.minimum_spend
        );



    const matchedTier =
      activeTiers.find(
        (tier) =>
          totalSpent >=
          tier.minimum_spend
      );



    return (
      matchedTier ??
      activeTiers[
        activeTiers.length - 1
      ]
    );

  }





  /**
   * Award order rewards
   */
  async awardPoints(
    customerId: string,
    orderId: string,
    orderAmount: number
  ) {


    const points =
      await this.calculateEarnPoints(
        orderAmount
      );



    if (points <= 0) {
      return null;
    }



    const { data, error } =
      await supabase.rpc(
        "award_reward_points",
        {
          p_customer_id:
            customerId,

          p_order_id:
            orderId,

          p_points:
            points,

          p_description:
            "Reward for order",
        }
      );



    if (error) {
      throw error;
    }



    return data;

  }





  /**
   * Redeem points
   */
  async redeemPoints(
    customerId: string,
    points: number,
    description =
      "Reward Redemption"
  ) {


    const rules =
      await rewardsService.getRewardRules();



    if (
      !rules.redemption_enabled
    ) {

      throw new Error(
        "Reward redemption is disabled."
      );

    }



    const wallet =
      await rewardWalletService.ensureWallet(
        customerId
      );



    if (
      wallet.current_points <
      points
    ) {

      throw new Error(
        "Insufficient reward points."
      );

    }



    if (
      points <
      rules.minimum_redeem_points
    ) {

      throw new Error(
        `Minimum redemption is ${rules.minimum_redeem_points} points.`
      );

    }



    await rewardTransactionService.create({

      customer_id:
        customerId,

      transaction_type:
        "redeem",

      points:
        -points,

      description,

    });



    return rewardWalletService.updateWallet(
      customerId,
      {

        current_points:
          wallet.current_points -
          points,


        lifetime_redeemed:
          wallet.lifetime_redeemed +
          points,

      }
    );

  }





  /**
   * Manual add points
   */
  async manualAddPoints(
    customerId: string,
    points: number,
    description =
      "Manual Reward Adjustment"
  ) {


    const wallet =
      await rewardWalletService.ensureWallet(
        customerId
      );



    await rewardTransactionService.create({

      customer_id:
        customerId,

      transaction_type:
        "manual_add",

      points,

      description,

    });



    return rewardWalletService.updateWallet(
      customerId,
      {

        current_points:
          wallet.current_points +
          points,


        lifetime_earned:
          wallet.lifetime_earned +
          points,

      }
    );

  }





  /**
   * Manual deduct points
   */
  async manualDeductPoints(
    customerId: string,
    points: number,
    description =
      "Manual Reward Deduction"
  ) {


    const wallet =
      await rewardWalletService.ensureWallet(
        customerId
      );



    if (
      wallet.current_points <
      points
    ) {

      throw new Error(
        "Customer does not have enough reward points."
      );

    }



    await rewardTransactionService.create({

      customer_id:
        customerId,

      transaction_type:
        "manual_deduct",

      points:
        -points,

      description,

    });



    return rewardWalletService.updateWallet(
      customerId,
      {

        current_points:
          wallet.current_points -
          points,

      }
    );

  }





  /**
   * Update tier
   */
  async recalculateTier(
    customerId: string,
    lifetimeSpend: number
  ) {


    const tier =
      await this.calculateTier(
        lifetimeSpend
      );



    if (!tier) {
      return;
    }



    return rewardWalletService.updateWallet(
      customerId,
      {

        tier_id:
          tier.id,

      }
    );

  }





  /**
   * Recalculate wallet totals
   */
  async recalculateCustomerRewards(
    customerId: string
  ) {


    const transactions =
      await rewardTransactionService.getCustomerTransactions(
        customerId
      );



    const currentPoints =
      transactions.reduce(
        (sum, transaction) =>
          sum + transaction.points,
        0
      );



    const lifetimeEarned =
      transactions
        .filter(
          (transaction) =>
            transaction.points > 0
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.points,
          0
        );



    const lifetimeRedeemed =
      Math.abs(
        transactions
          .filter(
            (transaction) =>
              transaction.transaction_type ===
              "redeem"
          )
          .reduce(
            (sum, transaction) =>
              sum + transaction.points,
            0
          )
      );



    return rewardWalletService.updateWallet(
      customerId,
      {

        current_points:
          currentPoints,

        lifetime_earned:
          lifetimeEarned,

        lifetime_redeemed:
          lifetimeRedeemed,

      }
    );

  }


}


export const rewardEngine =
  new RewardEngine();