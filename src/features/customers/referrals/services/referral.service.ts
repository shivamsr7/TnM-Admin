import { supabase } from "@/lib/supabase";

import type {
  CustomerReferral,
  ReferralFormData,
} from "../types/referral.types";
import {
  generateReferralCode,
} from "../utils/generateReferralCode";

const TABLE = "customer_referrals";


export const referralService = {


  async getByCustomer(
    customerId: string
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .eq(
          "customer_id",
          customerId
        )
        .single();


    if (error) {

      if (
        error.code === "PGRST116"
      ) {
        return null;
      }

      throw error;
    }


    return data as CustomerReferral;

  },



  async create(
    customerId: string,
    payload: ReferralFormData
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .insert({

          customer_id: customerId,

          referral_code:
            payload.referral_code,

          referred_by:
            payload.referred_by ?? null,

        })
        .select()
        .single();


    if (error) throw error;


    return data as CustomerReferral;

  },



  async update(
    id: string,
    payload: ReferralFormData
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .update({

          referral_code:
            payload.referral_code,

          referred_by:
            payload.referred_by ?? null,

        })
        .eq(
          "id",
          id
        )
        .select()
        .single();


    if (error) throw error;


    return data as CustomerReferral;

  },



  async getReferredCustomers(
    customerId: string
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .select(`
          id,
          customer_id,
          referral_code,
          total_referrals,
          successful_referrals,
          customers:customer_id(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq(
          "referred_by",
          customerId
        );


    if (error) throw error;


    return data;

  },
async updateReferralCounts(
  customerId: string
) {

  const { data, error } =
    await supabase
      .from("customer_referrals")
      .select(
        "total_referrals, successful_referrals"
      )
      .eq(
        "customer_id",
        customerId
      )
      .single();


  if (error) throw error;



  const { error: updateError } =
    await supabase
      .from("customer_referrals")
      .update({

        total_referrals:
          (data.total_referrals ?? 0) + 1,

        successful_referrals:
          (data.successful_referrals ?? 0) + 1,

      })
      .eq(
        "customer_id",
        customerId
      );


  if (updateError) throw updateError;

},
async createCustomerReferral(
  customerId: string,
  customerName?: string
) {


  const referralCode =
    generateReferralCode(
      customerName
    );


  const { data, error } =
    await supabase
      .from("customer_referrals")
      .insert({

        customer_id:
          customerId,

        referral_code:
          referralCode,

      })
      .select()
      .single();



  if (error) {
    throw error;
  }


  return data;

},
};