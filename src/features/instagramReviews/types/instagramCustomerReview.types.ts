export interface InstagramCustomerReview {
  id: string;
  customer_name: string;
  instagram_username: string | null;
  review_text: string | null;
  rating: number;
  screenshot_url: string;
  screenshot_path: string;
  product_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface InstagramCustomerReviewFormData {
  customer_name: string;
  instagram_username?: string;
  review_text?: string;
  rating: number;
  screenshot_url: string;
  screenshot_path: string;
  product_id?: string | null;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
}