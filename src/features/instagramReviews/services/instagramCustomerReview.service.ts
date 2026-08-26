import { supabase } from "@/lib/supabase";

import type {
  InstagramCustomerReview,
  InstagramCustomerReviewFormData,
} from "../types/instagramCustomerReview.types";

const TABLE = "instagram_customer_reviews";

export const instagramCustomerReviewService = {
  async getAll(): Promise<InstagramCustomerReview[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  },

  async getPublished(): Promise<InstagramCustomerReview[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  },

  async getById(id: string): Promise<InstagramCustomerReview> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async create(
    values: InstagramCustomerReviewFormData
  ): Promise<InstagramCustomerReview> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(values)
      .select("*")
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    values: Partial<InstagramCustomerReviewFormData>
  ): Promise<InstagramCustomerReview> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(values)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id: string): Promise<void> {
    const { data: review, error: fetchError } = await supabase
      .from(TABLE)
      .select("screenshot_path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { error: deleteError } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    if (review?.screenshot_path) {
      await supabase.storage
        .from("media")
        .remove([review.screenshot_path]);
    }
  },
};