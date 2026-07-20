import { supabase } from "@/lib/supabase";

import type {
  Coupon,
  CouponFormData,
} from "../types/coupon.types";

const TABLE = "coupons";

export const couponService = {
  async getAll(): Promise<Coupon[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data ?? [];
  },

  async getById(
    id: string
  ): Promise<Coupon> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async create(
    values: CouponFormData
  ): Promise<Coupon> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    values: CouponFormData
  ): Promise<Coupon> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(values)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};