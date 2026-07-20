import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().trim().min(3).max(30).transform(v => v.toUpperCase()),

  title: z.string().trim().min(3),

  description: z.string(),

  discount_type: z.enum(["percentage", "fixed"]),

  discount_value: z.number().positive(),

  minimum_order_amount: z.number().min(0),

  maximum_discount: z.number().nullable(),

  usage_limit: z.number().nullable(),

  one_use_per_customer: z.boolean(),

  starts_at: z.string().nullable(),

  expires_at: z.string().nullable(),

  is_active: z.boolean(),
});

export type CouponSchema = z.infer<typeof couponSchema>;