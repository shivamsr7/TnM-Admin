export type ReferralTransactionStatus =
  | "pending"
  | "completed"
  | "cancelled";


export interface ReferralTransaction {

  id: string;

  referrer_id: string;

  referred_customer_id: string;

  order_id: string | null;

  status: ReferralTransactionStatus;

  reward_points: number;

  created_at: string;

  completed_at: string | null;


  referred_customer?: {

    id: string;

    first_name: string;

    last_name: string | null;

    email: string | null;

    phone: string | null;

  };

}