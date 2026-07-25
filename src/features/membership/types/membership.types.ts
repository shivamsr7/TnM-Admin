export interface Membership {
  customer_id: string;

  customer_name: string;

  customer_email: string | null;

  customer_phone: string | null;

  tier_id: string | null;

  tier_name: string;

  badge_color: string;

  current_points: number;
benefits: string | null;
  lifetime_spend: number;

  progress: number;

  amount_to_next_tier: number;

  next_tier: {
    id: string;
    tier_name: string;
    minimum_spend: number;
  } | null;
}