import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { rewardTierSchema } from "../schemas/reward-tier.schema";

export function useRewardTierForm() {
  return useForm<
    z.input<typeof rewardTierSchema>,
    any,
    z.output<typeof rewardTierSchema>
  >({
    resolver: zodResolver(rewardTierSchema),

    defaultValues: {
      tier_name: "",

      minimum_spend: 0,

      multiplier: 1,

      benefits: "",

      badge_color: "#F59E0B",

      is_active: true,

      sort_order: 0,
    },
  });
}