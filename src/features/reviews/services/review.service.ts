import { supabase } from "@/lib/supabase";

import type {
  Review,
  ReviewStats,
  ReviewStatus,
} from "../types/review.types";

class ReviewService {
  async getAll(): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        product:products(
          id,
          name,
          slug,
          product_images(
            id,
            image_url,
            is_primary,
            sort_order
          )
        ),
        customer:customers(
          id,
          first_name,
          last_name
        ),
        order:orders(
          id,
          order_number
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []) as Review[];
  }

  async getById(id: string): Promise<Review> {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        product:products(
          id,
          name,
          slug,
          product_images(
            id,
            image_url,
            is_primary,
            sort_order
          )
        ),
        customer:customers(
          id,
          first_name,
          last_name
        ),
        order:orders(
          id,
          order_number
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as Review;
  }

  async updateStatus(
    id: string,
    status: ReviewStatus
  ): Promise<Review> {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data as Review;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async getStats(): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating,status");

    if (error) throw error;

    const reviews = data ?? [];

    const totalReviews = reviews.length;

    const approvedReviews = reviews.filter(
      (r) => r.status === "approved"
    ).length;

    const pendingReviews = reviews.filter(
      (r) => r.status === "pending"
    ).length;

    const rejectedReviews = reviews.filter(
      (r) => r.status === "rejected"
    ).length;

    const approved = reviews.filter(
      (r) => r.status === "approved"
    );

    const averageRating =
      approved.length === 0
        ? 0
        : Number(
            (
              approved.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / approved.length
            ).toFixed(1)
          );

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      rejectedReviews,
      averageRating,
    };
  }
}

export const reviewService = new ReviewService();