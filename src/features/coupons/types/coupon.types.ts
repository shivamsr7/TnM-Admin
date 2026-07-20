export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;

  code: string;

  title: string;

  description: string | null;

  discount_type: DiscountType;

  discount_value: number;

  minimum_order_amount: number;

  maximum_discount: number | null;

  usage_limit: number | null;

  used_count: number;

  one_use_per_customer: boolean;

  starts_at: string | null;

  expires_at: string | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}

export type CouponFormData = Omit<
  Coupon,
  "id" | "created_at" | "updated_at" | "used_count"
>;