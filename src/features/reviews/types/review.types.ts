export type ReviewStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface Review {
  id: string;

  product_id: string;

  customer_id: string | null;

  order_id: string | null;

  rating: 1 | 2 | 3 | 4 | 5;

  title: string | null;

  review: string;

  status: ReviewStatus;

  is_verified: boolean;

  created_at: string;

  updated_at: string;

  product?: {
    id: string;
    name: string;
    slug: string;
    product_images?: {
      id: string;
      image_url: string;
      is_primary: boolean;
      sort_order: number;
    }[];
  };

  customer?: {
    id: string;
    first_name: string;
    last_name: string | null;
  };

  order?: {
    id: string;
    order_number: string;
  };
}

export interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
}

export interface ReviewFilters {
  search: string;
  status: ReviewStatus | "all";
  rating: number | "all";
}