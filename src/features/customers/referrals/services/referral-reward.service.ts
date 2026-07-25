import { rewardsService } from "@/features/rewards/services/rewards.service";

import {
  REFERRAL_REWARDS,
} from "@/features/rewards/constants/reward.constants";

import type {
  ReferralTransaction,
} from "../types/referral-transaction.types";


export const referralRewardService = {


  async releaseReferralRewards(
    transaction: ReferralTransaction
  ) {


    // Referrer gets 500 points

    await rewardsService.addPoints(

      transaction.referrer_id,

      REFERRAL_REWARDS.REFERRER_POINTS,

      "Referral completed reward",

      undefined,

      undefined,

      "referral"

    );



    // Referred customer gets 250 points

    await rewardsService.addPoints(

      transaction.referred_customer_id,

      REFERRAL_REWARDS.REFERRED_CUSTOMER_POINTS,

      "Referral signup reward",

      undefined,

      undefined,

      "referral"

    );


  },


};