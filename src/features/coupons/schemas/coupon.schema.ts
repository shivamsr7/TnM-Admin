import { z } from "zod";

const nullableNumber = z
  .number()
  .min(0)
  .nullable();

const nullableInteger = z
  .number()
  .int()
  .min(0)
  .nullable();

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .transform((v) =>
        v.toUpperCase()
      ),

    title: z
      .string()
      .trim()
      .min(3),

    description:
      z.string(),

    discount_type:
      z.enum([
        "percentage",
        "fixed",
        "free_shipping",
        "free_gift",
      ]),

    discount_value:
      z.number().min(0),

    minimum_order_amount:
      z.number().min(0),

    maximum_discount:
      nullableNumber,

    usage_limit:
      nullableInteger,

    one_use_per_customer:
      z.boolean(),

    starts_at:
      z.string().nullable(),

    expires_at:
      z.string().nullable(),

    is_active:
      z.boolean(),

    spin_enabled:
      z.boolean(),

    spin_probability:
      z.number().int().min(0),

    reward_display_name:
      z.string().nullable(),

    show_in_cart:
      z.boolean(),

    cart_display_text:
      z.string().nullable(),

    cart_display_priority:
      z.number().int().min(0),

    apply_scope:
      z.enum([
        "all",
        "products",
        "categories",
        "collections",
        "brands",
        "tags",
      ]),

    customer_scope:
      z.enum([
        "all",
        "new",
        "existing",
        "selected",
      ]),

    condition_logic:
      z.enum([
        "all",
        "any",
      ]),

    stacking_mode:
      z.enum([
        "exclusive",
        "stackable",
      ]),

    auto_apply:
      z.boolean(),

    min_cart_quantity:
      nullableInteger,

    max_cart_quantity:
      nullableInteger,

    min_eligible_quantity:
      nullableInteger,

    max_eligible_quantity:
      nullableInteger,

    min_eligible_subtotal:
      nullableNumber,

    max_eligible_subtotal:
      nullableNumber,

    min_previous_orders:
      nullableInteger,

    max_previous_orders:
      nullableInteger,

    min_lifetime_spend:
      nullableNumber,

    max_lifetime_spend:
      nullableNumber,

    first_order_only:
      z.boolean(),

    new_customer_only:
      z.boolean(),

    existing_customer_only:
      z.boolean(),

    offer_type:
      z.enum([
        "standard",
        "buy_x_get_y",
      ]),

    buy_quantity:
      nullableInteger,

    get_quantity:
      nullableInteger,

    get_discount_type:
      z
        .enum([
          "percentage",
          "fixed",
          "free",
        ])
        .nullable(),

    get_discount_value:
      nullableNumber,
  })
  .superRefine(
    (values, ctx) => {
      const pairs = [
        [
          "min_cart_quantity",
          "max_cart_quantity",
        ],
        [
          "min_eligible_quantity",
          "max_eligible_quantity",
        ],
        [
          "min_eligible_subtotal",
          "max_eligible_subtotal",
        ],
        [
          "min_previous_orders",
          "max_previous_orders",
        ],
        [
          "min_lifetime_spend",
          "max_lifetime_spend",
        ],
      ] as const;

      for (const [
        minKey,
        maxKey,
      ] of pairs) {
        const min =
          values[minKey];
        const max =
          values[maxKey];

        if (
          min !== null &&
          max !== null &&
          min > max
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [maxKey],
            message:
              "Maximum cannot be less than minimum.",
          });
        }
      }

      if (
        values.apply_scope !==
          "all" &&
        values.offer_type ===
          "standard"
      ) {
        // Actual target rows are managed separately.
        // This keeps the form schema independent of the
        // selected product/category IDs.
      }

      if (
        values.offer_type ===
        "buy_x_get_y"
      ) {
        if (
          !values.buy_quantity ||
          values.buy_quantity < 1
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "buy_quantity",
            ],
            message:
              "Buy quantity must be at least 1.",
          });
        }

        if (
          !values.get_quantity ||
          values.get_quantity < 1
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "get_quantity",
            ],
            message:
              "Get quantity must be at least 1.",
          });
        }

        if (
          !values.get_discount_type
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "get_discount_type",
            ],
            message:
              "Select a Get discount type.",
          });
        }
      }
    }
  );

export type CouponSchema =
  z.infer<typeof couponSchema>;
