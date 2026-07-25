export interface CustomerRewards {
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
lifetime_spend: number;
  created_at: string;
  updated_at: string;

  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;

  tier?: {
    id: string;
    tier_name: string;
    multiplier: number;
    badge_color: string;
  } | null;
}

export interface RewardTransaction {
  id: string;

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

  created_at: string;
}

export interface RewardRule {
  id: string;

  rewards_enabled: boolean;

  spend_amount: number;
  earn_points: number;

  redemption_enabled: boolean;
  minimum_redeem_points: number;
  max_redeem_percentage: number;

  point_value_points: number;
  point_value_amount: number;

  welcome_bonus: number;
  birthday_bonus: number;
  first_order_bonus: number;
  referral_bonus: number;

  award_on: "placed" | "paid" | "delivered";

  ignore_cancelled: boolean;
  ignore_returned: boolean;
  ignore_refunded: boolean;

  reverse_points: boolean;

  created_at: string;
  updated_at: string;
}

export interface RewardTier {
  id: string;

  tier_name: string;

  minimum_spend: number;

  multiplier: number;

  benefits: string | null;

  badge_color: string;

  is_active: boolean;

  sort_order: number;

  created_at: string;

  updated_at: string;
}