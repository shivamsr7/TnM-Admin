export interface CustomerRewardWallet {
  id: string;

  customer_id: string;

  tier_id: string | null;

  current_points: number;

  lifetime_earned: number;

  lifetime_redeemed: number;

  expired_points: number;

  welcome_bonus_given: boolean;

  birthday_bonus_given: boolean;

  referral_count: number;

  created_at: string;

  updated_at: string;
}