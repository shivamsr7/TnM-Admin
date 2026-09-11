import { supabase } from "@/lib/supabase";

import type {
  BirthdayCouponSettings,
  BirthdayCouponSettingsFormData,
} from "../types/birthdayCoupon.types";

const TABLE =
  "birthday_coupon_settings";

export const birthdayCouponService = {

  async getSettings(): Promise<BirthdayCouponSettings | null> {

    const {
      data,
      error,
    } = await supabase
      .from(TABLE)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },


  async updateSettings(
    values: BirthdayCouponSettingsFormData
  ): Promise<BirthdayCouponSettings> {

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from(TABLE)
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }


    if (!existing) {

      const {
        data,
        error,
      } = await supabase
        .from(TABLE)
        .insert(values)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data;
    }


    const {
      data,
      error,
    } = await supabase
      .from(TABLE)
      .update({
        ...values,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

};