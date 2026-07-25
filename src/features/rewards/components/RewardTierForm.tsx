import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRewardTierForm } from "../hooks/useRewardTierForm";
import type { RewardTier } from "../types";

interface Props {
  initialData?: RewardTier;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
}

export default function RewardTierForm({
  initialData,
  onSubmit,
  isLoading,
}: Props) {
  const form = useRewardTierForm();

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      tier_name: initialData.tier_name,
      minimum_spend: initialData.minimum_spend,
      multiplier: initialData.multiplier,
      benefits: initialData.benefits ?? "",
      badge_color: initialData.badge_color,
      is_active: initialData.is_active,
      sort_order: initialData.sort_order,
    });
  }, [initialData, form]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          placeholder="Tier Name"
          {...form.register("tier_name")}
        />

        <Input
          type="number"
          placeholder="Minimum Spend"
          {...form.register("minimum_spend", {
            valueAsNumber: true,
          })}
        />

        <Input
          type="number"
          step="0.1"
          placeholder="Multiplier"
          {...form.register("multiplier", {
            valueAsNumber: true,
          })}
        />

        <Input
          placeholder="Benefits"
          {...form.register("benefits")}
        />

        <Input
          type="color"
          {...form.register("badge_color")}
        />

        <Input
          type="number"
          placeholder="Sort Order"
          {...form.register("sort_order", {
            valueAsNumber: true,
          })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...form.register("is_active")}
          />

          Active
        </label>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Tier"}
        </Button>
      </form>
    </FormProvider>
  );
}