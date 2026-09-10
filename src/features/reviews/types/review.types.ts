export type ReviewStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface ReviewProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
  product_images: ReviewProductImage[];
}

export interface ReviewCustomer {
  id: string;
  first_name: string;
  last_name: string | null;
}

export interface ReviewOrder {
  id: string;
  order_number: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string | null;
  order_id: string | null;

  rating: number;
  title: string | null;
  review: string;

  status: ReviewStatus;
  is_verified: boolean;

  created_at: string;
  updated_at: string;

  product?: ReviewProduct | null;
  customer?: ReviewCustomer | null;
  order?: ReviewOrder | null;
}

export interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
}


/*
 * =========================================================
 * REVIEW REQUEST PRODUCT
 * =========================================================
 */

export interface ReviewRequestProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number | null;
}


/*
 * =========================================================
 * REVIEW REQUEST RESPONSE
 * =========================================================
 */

export interface ReviewRequestResponse {
  valid: boolean;
  alreadyReviewed?: boolean;
  reason?: string;
  availableAt?: string;
  product?: ReviewRequestProduct;
}


/*
 * =========================================================
 * TOKEN REVIEW SUBMISSION
 * =========================================================
 */

export interface SubmitTokenReviewInput {
  token: string;
  productSlug: string;
  rating: number;
  title: string | null;
  review: string;
}

export interface SubmitTokenReviewResponse {
  success: boolean;
  reviewId: string;
  productId: string;
  orderId: string;
}