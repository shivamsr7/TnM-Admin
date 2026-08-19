export type DiscountType =
  | "percentage"
  | "fixed"
  | "free_shipping"
  | "free_gift";

export type CouponApplyScope =
  | "all"
  | "products"
  | "categories"
  | "collections"
  | "brands"
  | "tags";

export type CouponCustomerScope =
  | "all"
  | "new"
  | "existing"
  | "selected";

export type CouponConditionLogic =
  | "all"
  | "any";

export type CouponStackingMode =
  | "exclusive"
  | "stackable";

export type CouponOfferType =
  | "standard"
  | "buy_x_get_y";

export type CouponTargetType =
  | "product"
  | "category"
  | "collection"
  | "brand"
  | "tag";

export type CouponTargetMode =
  | "include"
  | "exclude";

export type CouponGetDiscountType =
  | "percentage"
  | "fixed"
  | "free";

export type CouponConditionType =
  | "first_order"
  | "new_customer"
  | "existing_customer"
  | "min_previous_orders"
  | "max_previous_orders"
  | "min_lifetime_spend"
  | "max_lifetime_spend"
  | "min_cart_quantity"
  | "max_cart_quantity"
  | "min_eligible_quantity"
  | "max_eligible_quantity"
  | "min_eligible_subtotal"
  | "max_eligible_subtotal"
  | "customer_id"
  | "customer_email"
  | "customer_phone";

export interface CouponTarget {
  id: string;
  coupon_id: string;
  target_type: CouponTargetType;
  target_id: string;
  target_mode: CouponTargetMode;
  created_at: string;
}

export interface CouponCustomer {
  id: string;
  coupon_id: string;
  customer_id: string;
  created_at: string;
}

export interface CouponMembershipTier {
  id: string;
  coupon_id: string;
  tier_id: string;
  created_at: string;
}

export interface CouponCondition {
  id: string;
  coupon_id: string;
  condition_type: CouponConditionType | string;
  condition_value: unknown;
  condition_group: number;
  created_at: string;
}

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

  spin_enabled: boolean;
  spin_probability: number;
  reward_display_name: string | null;

  show_in_cart: boolean;
  cart_display_text: string | null;
  cart_display_priority: number;

  apply_scope: CouponApplyScope;
  customer_scope: CouponCustomerScope;
  condition_logic: CouponConditionLogic;
  stacking_mode: CouponStackingMode;
  auto_apply: boolean;

  min_cart_quantity: number | null;
  max_cart_quantity: number | null;

  min_eligible_quantity: number | null;
  max_eligible_quantity: number | null;

  min_eligible_subtotal: number | null;
  max_eligible_subtotal: number | null;

  min_previous_orders: number | null;
  max_previous_orders: number | null;

  min_lifetime_spend: number | null;
  max_lifetime_spend: number | null;

  first_order_only: boolean;
  new_customer_only: boolean;
  existing_customer_only: boolean;

  offer_type: CouponOfferType;
  buy_quantity: number | null;
  get_quantity: number | null;
  get_discount_type: CouponGetDiscountType | null;
  get_discount_value: number | null;

  created_at: string;
  updated_at: string;
}

export type CouponFormData = Omit<
  Coupon,
  "id" | "created_at" | "updated_at" | "used_count"
>;

export interface CouponValidationCartItem {
  product_id: string;
  quantity: number;
  unit_price: number;

  category_ids?: string[];
  collection_ids?: string[];
  brand_id?: string | null;
  tag_ids?: string[];
}

export interface CouponCustomerContext {
  id?: string | null;
  email?: string | null;
  phone?: string | null;

  previous_orders?: number;
  lifetime_spend?: number;

  is_new_customer?: boolean;
  is_first_order?: boolean;

  membership_tier_id?: string | null;
}

export interface CouponValidationInput {
  coupon: Coupon;
  cart_items: CouponValidationCartItem[];
  order_subtotal: number;
  customer?: CouponCustomerContext | null;

  target_rows?: CouponTarget[];
  customer_rows?: CouponCustomer[];
  membership_rows?: CouponMembershipTier[];
  condition_rows?: CouponCondition[];
}

export interface CouponValidationResult {
  valid: boolean;
  coupon: Coupon;

  discount: number;
  eligible_subtotal: number;
  eligible_quantity: number;

  freeShipping: boolean;
  freeGift: boolean;

  message?: string;
}
