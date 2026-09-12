import { supabase } from "@/lib/supabase";
import type {
  ReviewMedia,
  ReviewMediaType,
} from "../types/reviewMedia.types";

class ReviewMediaService {
  async getByReviewId(
    reviewId: string
  ): Promise<ReviewMedia[]> {
    const { data, error } = await supabase
      .from("review_media")
      .select(`
        id,
        review_id,
        media_type,
        media_url,
        storage_path,
        thumbnail_url,
        sort_order,
        created_at
      `)
      .eq("review_id", reviewId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []) as ReviewMedia[];
  }

  async createMany(
    media: Array<{
      review_id: string;
      media_type: ReviewMediaType;
      media_url: string;
      storage_path?: string | null;
      thumbnail_url?: string | null;
      sort_order?: number;
    }>
  ): Promise<ReviewMedia[]> {
    const { data, error } = await supabase
      .from("review_media")
      .insert(media)
      .select();

    if (error) {
      throw error;
    }

    return (data ?? []) as ReviewMedia[];
  }

  async deleteById(
    mediaId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("review_media")
      .delete()
      .eq("id", mediaId);

    if (error) {
      throw error;
    }
  }

  async deleteByReviewId(
    reviewId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("review_media")
      .delete()
      .eq("review_id", reviewId);

    if (error) {
      throw error;
    }
  }
}

export const reviewMediaService =
  new ReviewMediaService();