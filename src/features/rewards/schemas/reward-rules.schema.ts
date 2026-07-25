import { z } from "zod";

export const rewardRulesSchema = z.object({
  rewards_enabled: z.boolean(),

  spend_amount: z.coerce.number().min(1),
  earn_points: z.coerce.number().min(1),

  redemption_enabled: z.boolean(),

  minimum_redeem_points: z.coerce.number().min(0),
  max_redeem_percentage: z.coerce.number().min(0).max(100),

  point_value_points: z.coerce.number().min(1),
  point_value_amount: z.coerce.number().min(1),

  welcome_bonus: z.coerce.number().min(0),
  birthday_bonus: z.coerce.number().min(0),
  first_order_bonus: z.coerce.number().min(0),
  referral_bonus: z.coerce.number().min(0),

  award_on: z.enum([
    "placed",
    "paid",
    "delivered",
  ]),

  ignore_cancelled: z.boolean(),
  ignore_returned: z.boolean(),
  ignore_refunded: z.boolean(),

  reverse_points: z.boolean(),
});

export type RewardRulesFormValues =
  z.output<typeof rewardRulesSchema>;