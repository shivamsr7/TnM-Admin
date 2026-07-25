export interface CustomerReferral {

  id: string;

  customer_id: string;

  referral_code: string;

  referred_by: string | null;

  total_referrals: number;

  successful_referrals: number;

  created_at: string;

  updated_at?: string;

}



export interface ReferralFormData {

  referral_code: string;

  referred_by?: string | null;

}