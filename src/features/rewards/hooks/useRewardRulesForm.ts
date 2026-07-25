import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { rewardRulesSchema } from "../schemas/reward-rules.schema";

export function useRewardRulesForm() {
  return useForm<
    z.input<typeof rewardRulesSchema>,
    any,
    z.output<typeof rewardRulesSchema>
  >({
    resolver: zodResolver(rewardRulesSchema),

    defaultValues: {
      rewards_enabled: true,

      spend_amount: 100,
      earn_points: 1,

      redemption_enabled: true,

      minimum_redeem_points: 1000,
      max_redeem_percentage: 20,

      point_value_points: 1000,
      point_value_amount: 10,

      welcome_bonus: 50,
      birthday_bonus: 100,
      first_order_bonus: 50,
      referral_bonus: 200,

      award_on: "delivered",

      ignore_cancelled: true,
      ignore_returned: true,
      ignore_refunded: true,

      reverse_points: true,
    },
  });
}