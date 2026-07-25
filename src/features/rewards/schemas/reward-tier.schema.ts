import { z } from "zod";

export const rewardTierSchema = z.object({
  tier_name: z.string().min(2, "Tier name is required"),

  minimum_spend: z.coerce
    .number()
    .min(0, "Minimum spend cannot be negative"),

  multiplier: z.coerce
    .number()
    .min(1, "Multiplier must be at least 1"),

  benefits: z.string().nullable().optional(),

  badge_color: z.string(),

  is_active: z.boolean(),

  sort_order: z.coerce.number().min(0),
});

export type RewardTierFormValues =
  z.output<typeof rewardTierSchema>;