import { supabase } from "@/lib/supabase";

import type {
  Coupon,
  CouponCondition,
  CouponCustomer,
  CouponCustomerContext,
  CouponFormData,
  CouponMembershipTier,
  CouponTarget,
  CouponValidationCartItem,
  CouponValidationInput,
  CouponValidationResult,
} from "../types/coupon.types";

const TABLE = "coupons";

const roundMoney = (
  value: number
) =>
  Math.max(
    0,
    Math.round(
      (value + Number.EPSILON) *
        100
    ) / 100
  );

const getCartQuantity = (
  items: CouponValidationCartItem[]
) =>
  items.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

const itemMatchesTarget = (
  item: CouponValidationCartItem,
  target: CouponTarget
) => {
  switch (
    target.target_type
  ) {
    case "product":
      return (
        item.product_id ===
        target.target_id
      );

    case "category":
      return (
        item.category_ids ??
        []
      ).includes(
        target.target_id
      );

    case "collection":
      return (
        item.collection_ids ??
        []
      ).includes(
        target.target_id
      );

    case "brand":
      return (
        item.brand_id ===
        target.target_id
      );

    case "tag":
      return (
        item.tag_ids ??
        []
      ).includes(
        target.target_id
      );

    default:
      return false;
  }
};

const calculateEligibleItems = (
  coupon: Coupon,
  items: CouponValidationCartItem[],
  targets: CouponTarget[]
) => {
  if (
    coupon.apply_scope ===
      "all" ||
    targets.length === 0
  ) {
    return items;
  }

  const relevantTypes =
    new Set([
      coupon.apply_scope ===
      "products"
        ? "product"
        : coupon.apply_scope ===
          "categories"
        ? "category"
        : coupon.apply_scope ===
          "collections"
        ? "collection"
        : coupon.apply_scope ===
          "brands"
        ? "brand"
        : "tag",
    ]);

  const applicableTargets =
    targets.filter(
      (target) =>
        relevantTypes.has(
          target.target_type
        )
    );

  if (
    applicableTargets.length ===
    0
  ) {
    return [];
  }

  const includes =
    applicableTargets.filter(
      (target) =>
        target.target_mode ===
        "include"
    );

  const excludes =
    applicableTargets.filter(
      (target) =>
        target.target_mode ===
        "exclude"
    );

  return items.filter(
    (item) => {
      const excluded =
        excludes.some(
          (target) =>
            itemMatchesTarget(
              item,
              target
            )
        );

      if (excluded) {
        return false;
      }

      if (
        includes.length === 0
      ) {
        return true;
      }

      return includes.some(
        (target) =>
          itemMatchesTarget(
            item,
            target
          )
      );
    }
  );
};

const calculateDiscount = (
  coupon: Coupon,
  eligibleSubtotal: number
) => {
  switch (
    coupon.discount_type
  ) {
    case "percentage":
      return roundMoney(
        Math.min(
          eligibleSubtotal *
            (coupon.discount_value /
              100),
          coupon.maximum_discount ??
            Number.POSITIVE_INFINITY
        )
      );

    case "fixed":
      return roundMoney(
        Math.min(
          coupon.discount_value,
          eligibleSubtotal
        )
      );

    case "free_shipping":
    case "free_gift":
      return 0;

    default:
      return 0;
  }
};

const isCustomerEligible = (
  coupon: Coupon,
  customer:
    | CouponCustomerContext
    | null
    | undefined,
  selectedCustomers:
    | CouponCustomer[],
  membershipTiers:
    | CouponMembershipTier[]
) => {
  if (
    coupon.customer_scope ===
    "all"
  ) {
    // Continue to additional explicit
    // customer flags below.
  }

  if (
    coupon.customer_scope ===
    "selected"
  ) {
    if (!customer?.id) {
      return false;
    }

    if (
      !selectedCustomers.some(
        (row) =>
          row.customer_id ===
          customer.id
      )
    ) {
      return false;
    }
  }

  if (
    coupon.customer_scope ===
    "new" &&
    !customer?.is_new_customer
  ) {
    return false;
  }

  if (
    coupon.customer_scope ===
    "existing" &&
    customer?.is_new_customer
  ) {
    return false;
  }

  if (
    coupon.first_order_only &&
    !customer?.is_first_order
  ) {
    return false;
  }

  if (
    coupon.new_customer_only &&
    !customer?.is_new_customer
  ) {
    return false;
  }

  if (
    coupon.existing_customer_only &&
    customer?.is_new_customer
  ) {
    return false;
  }

  if (
    coupon.min_previous_orders !==
      null &&
    (customer?.previous_orders ??
      0) <
      coupon.min_previous_orders
  ) {
    return false;
  }

  if (
    coupon.max_previous_orders !==
      null &&
    (customer?.previous_orders ??
      0) >
      coupon.max_previous_orders
  ) {
    return false;
  }

  if (
    coupon.min_lifetime_spend !==
      null &&
    (customer?.lifetime_spend ??
      0) <
      coupon.min_lifetime_spend
  ) {
    return false;
  }

  if (
    coupon.max_lifetime_spend !==
      null &&
    (customer?.lifetime_spend ??
      0) >
      coupon.max_lifetime_spend
  ) {
    return false;
  }

  if (
    membershipTiers.length >
    0 &&
    !membershipTiers.some(
      (row) =>
        row.tier_id ===
        customer?.membership_tier_id
    )
  ) {
    return false;
  }

  return true;
};

const isCouponWithinDates = (
  coupon: Coupon,
  now = new Date()
) => {
  if (!coupon.is_active) {
    return false;
  }

  if (
    coupon.starts_at &&
    new Date(coupon.starts_at) >
      now
  ) {
    return false;
  }

  if (
    coupon.expires_at &&
    new Date(coupon.expires_at) <
      now
  ) {
    return false;
  }

  return true;
};

export const couponService = {
  async getAll(): Promise<Coupon[]> {
    const {
      data,
      error,
    } = await supabase
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
    const {
      data,
      error,
    } = await supabase
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
    const {
      data,
      error,
    } = await supabase
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
    const {
      data,
      error,
    } = await supabase
      .from(TABLE)
      .update(values)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async setCartBanner(
    id: string,
    enabled: boolean
  ): Promise<Coupon> {
    if (enabled) {
      const {
        error:
          disableOthersError,
      } = await supabase
        .from(TABLE)
        .update({
          show_in_cart: false,
        })
        .eq(
          "show_in_cart",
          true
        )
        .neq("id", id);

      if (
        disableOthersError
      ) {
        throw disableOthersError;
      }
    }

    const {
      data,
      error,
    } = await supabase
      .from(TABLE)
      .update({
        show_in_cart: enabled,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async getCouponTargets(
    couponId: string
  ): Promise<CouponTarget[]> {
    const {
      data,
      error,
    } = await supabase
      .from("coupon_targets")
      .select("*")
      .eq(
        "coupon_id",
        couponId
      );

    if (error) throw error;

    return data ?? [];
  },

  async getCouponCustomers(
    couponId: string
  ): Promise<CouponCustomer[]> {
    const {
      data,
      error,
    } = await supabase
      .from("coupon_customers")
      .select("*")
      .eq(
        "coupon_id",
        couponId
      );

    if (error) throw error;

    return data ?? [];
  },

  async getCouponMembershipTiers(
    couponId: string
  ): Promise<CouponMembershipTier[]> {
    const {
      data,
      error,
    } = await supabase
      .from(
        "coupon_membership_tiers"
      )
      .select("*")
      .eq(
        "coupon_id",
        couponId
      );

    if (error) throw error;

    return data ?? [];
  },

  async getCouponConditions(
    couponId: string
  ): Promise<CouponCondition[]> {
    const {
      data,
      error,
    } = await supabase
      .from(
        "coupon_conditions"
      )
      .select("*")
      .eq(
        "coupon_id",
        couponId
      );

    if (error) throw error;

    return data ?? [];
  },

  async setCouponTargets(
    couponId: string,
    targets: Array<{
      target_type: CouponTarget["target_type"];
      target_id: string;
      target_mode?: CouponTarget["target_mode"];
    }>
  ) {
    const {
      error: deleteError,
    } = await supabase
      .from("coupon_targets")
      .delete()
      .eq(
        "coupon_id",
        couponId
      );

    if (deleteError) {
      throw deleteError;
    }

    if (!targets.length) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("coupon_targets")
      .insert(
        targets.map(
          (target) => ({
            coupon_id:
              couponId,
            target_type:
              target.target_type,
            target_id:
              target.target_id,
            target_mode:
              target.target_mode ??
              "include",
          })
        )
      );

    if (error) throw error;
  },

  async setCouponCustomers(
    couponId: string,
    customerIds: string[]
  ) {
    const {
      error: deleteError,
    } = await supabase
      .from(
        "coupon_customers"
      )
      .delete()
      .eq(
        "coupon_id",
        couponId
      );

    if (deleteError) {
      throw deleteError;
    }

    if (!customerIds.length) {
      return;
    }

    const {
      error,
    } = await supabase
      .from(
        "coupon_customers"
      )
      .insert(
        customerIds.map(
          (customerId) => ({
            coupon_id:
              couponId,
            customer_id:
              customerId,
          })
        )
      );

    if (error) throw error;
  },

  async setCouponMembershipTiers(
    couponId: string,
    tierIds: string[]
  ) {
    const {
      error: deleteError,
    } = await supabase
      .from(
        "coupon_membership_tiers"
      )
      .delete()
      .eq(
        "coupon_id",
        couponId
      );

    if (deleteError) {
      throw deleteError;
    }

    if (!tierIds.length) {
      return;
    }

    const {
      error,
    } = await supabase
      .from(
        "coupon_membership_tiers"
      )
      .insert(
        tierIds.map(
          (tierId) => ({
            coupon_id:
              couponId,
            tier_id:
              tierId,
          })
        )
      );

    if (error) throw error;
  },

  async setCouponConditions(
    couponId: string,
    conditions: Array<{
      condition_type: string;
      condition_value: unknown;
      condition_group?: number;
    }>
  ) {
    const {
      error: deleteError,
    } = await supabase
      .from(
        "coupon_conditions"
      )
      .delete()
      .eq(
        "coupon_id",
        couponId
      );

    if (deleteError) {
      throw deleteError;
    }

    if (!conditions.length) {
      return;
    }

    const {
      error,
    } = await supabase
      .from(
        "coupon_conditions"
      )
      .insert(
        conditions.map(
          (condition) => ({
            coupon_id:
              couponId,
            condition_type:
              condition.condition_type,
            condition_value:
              condition.condition_value,
            condition_group:
              condition.condition_group ??
              0,
          })
        )
      );

    if (error) throw error;
  },

  async validateCoupon(
    input: CouponValidationInput
  ): Promise<CouponValidationResult> {
    const {
      coupon,
      cart_items,
      order_subtotal,
      customer,
      target_rows = [],
      customer_rows = [],
      membership_rows = [],
    } = input;

    if (
      !isCouponWithinDates(
        coupon
      )
    ) {
      throw new Error(
        "This coupon is not currently active."
      );
    }

    if (
      coupon.usage_limit !==
        null &&
      coupon.used_count >=
        coupon.usage_limit
    ) {
      throw new Error(
        "This coupon has reached its usage limit."
      );
    }

    if (
      order_subtotal <
      coupon.minimum_order_amount
    ) {
      throw new Error(
        `Minimum order value is ₹${coupon.minimum_order_amount}.`
      );
    }

    if (
      coupon.one_use_per_customer &&
      !customer?.id
    ) {
      throw new Error(
        "Please sign in to use this coupon."
      );
    }

    const customerEligible =
      isCustomerEligible(
        coupon,
        customer,
        customer_rows,
        membership_rows
      );

    if (!customerEligible) {
      throw new Error(
        "This coupon is not available for your account."
      );
    }

    const cartQuantity =
      getCartQuantity(
        cart_items
      );

    if (
      coupon.min_cart_quantity !==
        null &&
      cartQuantity <
        coupon.min_cart_quantity
    ) {
      throw new Error(
        `Add at least ${coupon.min_cart_quantity} items to use this coupon.`
      );
    }

    if (
      coupon.max_cart_quantity !==
        null &&
      cartQuantity >
        coupon.max_cart_quantity
    ) {
      throw new Error(
        `This coupon is only valid for up to ${coupon.max_cart_quantity} items.`
      );
    }

    const eligibleItems =
      calculateEligibleItems(
        coupon,
        cart_items,
        target_rows
      );

    const eligibleQuantity =
      getCartQuantity(
        eligibleItems
      );

    const eligibleSubtotal =
      roundMoney(
        eligibleItems.reduce(
          (sum, item) =>
            sum +
            item.unit_price *
              item.quantity,
          0
        )
      );

    if (
      coupon.apply_scope !==
        "all" &&
      eligibleItems.length ===
        0
    ) {
      throw new Error(
        "This coupon does not apply to the products in your cart."
      );
    }

    if (
      coupon.min_eligible_quantity !==
        null &&
      eligibleQuantity <
        coupon.min_eligible_quantity
    ) {
      throw new Error(
        `You need at least ${coupon.min_eligible_quantity} eligible items to use this coupon.`
      );
    }

    if (
      coupon.max_eligible_quantity !==
        null &&
      eligibleQuantity >
        coupon.max_eligible_quantity
    ) {
      throw new Error(
        `This coupon is only valid for up to ${coupon.max_eligible_quantity} eligible items.`
      );
    }

    if (
      coupon.min_eligible_subtotal !==
        null &&
      eligibleSubtotal <
        coupon.min_eligible_subtotal
    ) {
      throw new Error(
        `Eligible products must total at least ₹${coupon.min_eligible_subtotal}.`
      );
    }

    if (
      coupon.max_eligible_subtotal !==
        null &&
      eligibleSubtotal >
        coupon.max_eligible_subtotal
    ) {
      throw new Error(
        `Eligible products can total at most ₹${coupon.max_eligible_subtotal}.`
      );
    }

    let discount =
      calculateDiscount(
        coupon,
        eligibleSubtotal
      );

    if (
      coupon.offer_type ===
      "buy_x_get_y"
    ) {
      if (
        !coupon.buy_quantity ||
        !coupon.get_quantity
      ) {
        throw new Error(
          "This Buy X Get Y coupon is not configured correctly."
        );
      }

      if (
        eligibleQuantity <
        coupon.buy_quantity
      ) {
        throw new Error(
          `Add at least ${coupon.buy_quantity} eligible items to use this offer.`
        );
      }

      const eligibleSets =
        Math.floor(
          eligibleQuantity /
            coupon.buy_quantity
        );

      const rewardedQuantity =
        eligibleSets *
        coupon.get_quantity;

      const rewardSubtotal =
        eligibleItems
          .slice()
          .sort(
            (a, b) =>
              a.unit_price -
              b.unit_price
          )
          .slice(
            0,
            Math.min(
              rewardedQuantity,
              eligibleItems.length
            )
          )
          .reduce(
            (sum, item) =>
              sum +
              item.unit_price *
                Math.min(
                  item.quantity,
                  rewardedQuantity
                ),
            0
          );

      switch (
        coupon.get_discount_type
      ) {
        case "percentage":
          discount = roundMoney(
            Math.min(
              rewardSubtotal *
                ((coupon.get_discount_value ??
                  0) /
                  100),
              coupon.maximum_discount ??
                Number.POSITIVE_INFINITY
            )
          );
          break;

        case "fixed":
          discount = roundMoney(
            Math.min(
              coupon.get_discount_value ??
                0,
              rewardSubtotal
            )
          );
          break;

        case "free":
          discount =
            roundMoney(
              rewardSubtotal
            );
          break;
      }
    }

    if (
      coupon.discount_type ===
      "free_shipping"
    ) {
      return {
        valid: true,
        coupon,
        discount: 0,
        eligible_subtotal:
          eligibleSubtotal,
        eligible_quantity:
          eligibleQuantity,
        freeShipping: true,
        freeGift: false,
      };
    }

    if (
      coupon.discount_type ===
      "free_gift"
    ) {
      return {
        valid: true,
        coupon,
        discount: 0,
        eligible_subtotal:
          eligibleSubtotal,
        eligible_quantity:
          eligibleQuantity,
        freeShipping: false,
        freeGift: true,
      };
    }

    if (discount <= 0) {
      throw new Error(
        "This coupon does not provide a discount for your cart."
      );
    }

    return {
      valid: true,
      coupon,
      discount,
      eligible_subtotal:
        eligibleSubtotal,
      eligible_quantity:
        eligibleQuantity,
      freeShipping: false,
      freeGift: false,
    };
  },

  async validateCouponById(
    couponId: string,
    cart_items: CouponValidationCartItem[],
    order_subtotal: number,
    customer?: CouponCustomerContext | null
  ) {
    const coupon =
      await this.getById(
        couponId
      );

    const [
      target_rows,
      customer_rows,
      membership_rows,
    ] = await Promise.all([
      this.getCouponTargets(
        couponId
      ),
      this.getCouponCustomers(
        couponId
      ),
      this.getCouponMembershipTiers(
        couponId
      ),
    ]);

    return this.validateCoupon({
      coupon,
      cart_items,
      order_subtotal,
      customer,
      target_rows,
      customer_rows,
      membership_rows,
    });
  },

  async saveCouponRules(
    couponId: string,
    {
      targets,
      customerIds,
      membershipTierIds,
    }: {
      targets: Array<{
        target_type: CouponTarget["target_type"];
        target_id: string;
        target_mode: CouponTarget["target_mode"];
      }>;
      customerIds: string[];
      membershipTierIds: string[];
    }
  ) {
    await Promise.all([
      this.setCouponTargets(
        couponId,
        targets
      ),
      this.setCouponCustomers(
        couponId,
        customerIds
      ),
      this.setCouponMembershipTiers(
        couponId,
        membershipTierIds
      ),
    ]);
  },

  async createWithRules(
    values: CouponFormData,
    rules: {
      targets: Array<{
        target_type: CouponTarget["target_type"];
        target_id: string;
        target_mode: CouponTarget["target_mode"];
      }>;
      customerIds: string[];
      membershipTierIds: string[];
    }
  ): Promise<Coupon> {
    const coupon =
      await this.create(values);

    try {
      await this.saveCouponRules(
        coupon.id,
        rules
      );

      return coupon;
    } catch (error) {
      /*
       * Prevent an orphan coupon when the relationship rows
       * fail immediately after creation.
       */
      try {
        await this.delete(
          coupon.id
        );
      } catch (rollbackError) {
        console.error(
          "Coupon relationship save failed and rollback also failed:",
          rollbackError
        );
      }

      throw error;
    }
  },

  async updateWithRules(
    id: string,
    values: CouponFormData,
    rules: {
      targets: Array<{
        target_type: CouponTarget["target_type"];
        target_id: string;
        target_mode: CouponTarget["target_mode"];
      }>;
      customerIds: string[];
      membershipTierIds: string[];
    }
  ): Promise<Coupon> {
    const coupon =
      await this.update(
        id,
        values
      );

    await this.saveCouponRules(
      coupon.id,
      rules
    );

    return coupon;
  },

  async delete(
    id: string
  ) {
    const {
      error,
    } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
