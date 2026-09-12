import { supabase } from "@/lib/supabase";

import {
  notificationService,
} from "@/features/notifications/services/notification.service";

import type {
  Review,
  ReviewStats,
  ReviewStatus,
} from "../types/review.types";

export type ReviewRewardType =
  | "text"
  | "image"
  | "video";


class ReviewService {

  async getAll(): Promise<Review[]> {

    const {
      data,
      error,
    } = await supabase
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
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return (data ?? []) as Review[];
  }


  async getById(
    id: string
  ): Promise<Review> {

    const {
      data,
      error,
    } = await supabase
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

    if (error) {
      throw error;
    }

    return data as Review;
  }


  async updateStatus(
    id: string,
    status: ReviewStatus,
    rewardType?: ReviewRewardType
  ): Promise<Review> {

    /*
     * =========================================================
     * APPROVE REVIEW
     * =========================================================
     *
     * Wallet credit + review approval are handled by the
     * secure server-side RPC.
     *
     * Email is sent only AFTER the RPC succeeds.
     *
     * Email failure will NEVER undo the review approval
     * or wallet credit.
     */

    if (status === "approved") {

      if (!rewardType) {
        throw new Error(
          "Review reward type is required for approval."
        );
      }


      /*
       * -------------------------------------------------------
       * 1. Approve review + credit wallet
       * -------------------------------------------------------
       */

      const {
        data,
        error,
      } = await supabase.rpc(
        "admin_approve_review_with_reward",
        {
          p_review_id: id,
          p_reward_type: rewardType,
        }
      );

      if (error) {
        throw error;
      }

      const approvedReview =
        data as Review;


      /*
       * -------------------------------------------------------
       * 2. If there is no customer, stop here.
       * -------------------------------------------------------
       */

      if (!approvedReview.customer_id) {
        console.warn(
          "Review approved but customer_id is missing. Review reward email skipped.",
          {
            reviewId: approvedReview.id,
          }
        );

        return approvedReview;
      }


      /*
       * -------------------------------------------------------
       * 3. Get reward-email data through a secure admin RPC
       * -------------------------------------------------------
       *
       * wallet_transactions is protected by RLS, so the browser
       * should not read the reward transaction directly.
       *
       * The RPC verifies admin access and returns only the data
       * required for the reward email.
       */

      const {
        data: emailData,
        error: emailDataError,
      } = await supabase.rpc(
        "admin_get_review_reward_email_data",
        {
          p_review_id: approvedReview.id,
        }
      );


      if (emailDataError) {

        console.error(
          "Review approved and wallet reward credited, but reward email data could not be loaded.",
          emailDataError
        );

        return approvedReview;
      }


      /*
       * -------------------------------------------------------
       * 4. No reward transaction means:
       *
       * - rewards disabled, OR
       * - reward amount was zero, OR
       * - approval happened without wallet credit.
       *
       * Therefore don't send a reward email.
       * -------------------------------------------------------
       */

      if (!emailData) {

        console.log(
          "Review approved without wallet reward. No reward email will be sent.",
          {
            reviewId:
              approvedReview.id,
            rewardType,
          }
        );

        return approvedReview;
      }


      /*
       * -------------------------------------------------------
       * 5. Customer email
       * -------------------------------------------------------
       */

      const customerEmail =
        typeof emailData.customer_email === "string"
          ? emailData.customer_email.trim()
          : "";


      if (!customerEmail) {

        console.warn(
          "Review reward credited, but customer email is missing.",
          {
            customerId:
              approvedReview.customer_id,
            reviewId:
              approvedReview.id,
          }
        );

        return approvedReview;
      }


      /*
       * -------------------------------------------------------
       * 6. Convert paise → rupees
       * -------------------------------------------------------
       */

      const rewardAmount =
        Number(
          emailData.reward_amount_paise
        ) / 100;


      const walletBalance =
        Number(
          emailData.wallet_balance_paise
        ) / 100;


      /*
       * -------------------------------------------------------
       * 7. Customer name
       * -------------------------------------------------------
       */

      const customerName =
        [
          emailData.customer_first_name,
          emailData.customer_last_name,
        ]
          .filter(Boolean)
          .join(" ")
          .trim() || "there";


      /*
       * -------------------------------------------------------
       * 8. Send reward email
       * -------------------------------------------------------
       */

      try {

        await notificationService.sendReviewRewardEmail({

          to:
            customerEmail,

          customerName,

          productName:
            emailData.product_name ||
            "your T&M Jewels product",

          rewardType,

          rewardAmount,

          walletBalance,

          expiresAt:
            emailData.expires_at ??
            null,

        });


        console.log(
          "✅ Review reward email sent successfully.",
          {
            reviewId:
              approvedReview.id,

            customerId:
              approvedReview.customer_id,

            rewardType,

            rewardAmount,

            walletBalance,

            expiresAt:
              emailData.expires_at,
          }
        );

      } catch (emailError) {

        /*
         * IMPORTANT:
         *
         * Email failure must NOT affect the already
         * successful review approval or wallet credit.
         */

        console.error(
          "⚠️ Review approved and wallet reward credited, but review reward email failed.",
          emailError
        );

      }


      return approvedReview;
    }


    /*
     * =========================================================
     * REJECT / OTHER STATUS
     * =========================================================
     *
     * Existing behaviour remains unchanged.
     */

    const {
      data,
      error,
    } = await supabase
      .from("reviews")
      .update({
        status,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Review;
  }


  async delete(
    id: string
  ): Promise<void> {

    const {
      error,
    } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }


  async getStats(): Promise<ReviewStats> {

    const {
      data,
      error,
    } = await supabase
      .from("reviews")
      .select(
        "rating,status"
      );

    if (error) {
      throw error;
    }

    const reviews =
      data ?? [];


    const totalReviews =
      reviews.length;


    const approvedReviews =
      reviews.filter(
        (r) =>
          r.status === "approved"
      ).length;


    const pendingReviews =
      reviews.filter(
        (r) =>
          r.status === "pending"
      ).length;


    const rejectedReviews =
      reviews.filter(
        (r) =>
          r.status === "rejected"
      ).length;


    const approved =
      reviews.filter(
        (r) =>
          r.status === "approved"
      );


    const averageRating =
      approved.length === 0
        ? 0
        : Number(
            (
              approved.reduce(
                (
                  sum,
                  review
                ) =>
                  sum +
                  review.rating,
                0
              ) /
              approved.length
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


export const reviewService =
  new ReviewService();