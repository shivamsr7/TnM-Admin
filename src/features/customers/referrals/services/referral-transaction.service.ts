import { supabase } from "@/lib/supabase";

import type {
  ReferralTransaction,
} from "../types/referral-transaction.types";


const TABLE =
  "referral_transactions";


export const referralTransactionService = {


  async getByReferrer(
    customerId: string
  ) {


    const { data, error } =
      await supabase
        .from(TABLE)
        .select(`
          *,
          referred_customer:customers!referred_customer_id(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq(
          "referrer_id",
          customerId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );


    if (error) throw error;


    return data as ReferralTransaction[];

  },
async completeReferral(
  transactionId: string
) {

  const { data, error } =
    await supabase
      .from("referral_transactions")
      .update({

        status: "completed",

        completed_at:
          new Date().toISOString(),

      })
      .eq(
        "id",
        transactionId
      )
      .select()
      .single();


  if (error) throw error;


  return data;

},
async cancelReferral(
  transactionId: string
) {

  const { data, error } =
    await supabase
      .from("referral_transactions")
      .update({

        status: "cancelled",

      })
      .eq(
        "id",
        transactionId
      )
      .select()
      .single();


  if (error) throw error;


  return data;

},
async createReferralTransaction({
  referralCode,
  referredCustomerId,
}: {
  referralCode: string;
  referredCustomerId: string;
}) {


  // Find referrer by referral code

  const { data: referral, error: referralError } =
    await supabase
      .from("customer_referrals")
      .select("customer_id")
      .eq(
        "referral_code",
        referralCode
      )
      .single();



  if (referralError) {
    throw referralError;
  }



  const { data, error } =
    await supabase
      .from("referral_transactions")
      .insert({

        referrer_id:
          referral.customer_id,

        referred_customer_id:
          referredCustomerId,

        status:
          "pending",

        reward_points:
          0,

      })
      .select()
      .single();



  if (error) {
    throw error;
  }



  return data;

},
};

