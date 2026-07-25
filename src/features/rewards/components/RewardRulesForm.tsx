import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { useRewardRulesForm } from "../hooks/useRewardRulesForm";
import {
  useRewardRules,
  useUpdateRewardRules,
} from "../hooks/useRewardRules";

import EarnRulesCard from "./EarnRulesCard";
import RedeemRulesCard from "./RedeemRulesCard";
import BonusRulesCard from "./BonusRulesCard";
import OrderRulesCard from "./OrderRulesCard";

export default function RewardRulesForm() {
  const form = useRewardRulesForm();

  const { data, isLoading } = useRewardRules();

  const updateRewardRules = useUpdateRewardRules();

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (!data) return;

    updateRewardRules.mutate({
      id: data.id,
      payload: values,
    });
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading reward rules...
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <EarnRulesCard />

        <RedeemRulesCard />

        <BonusRulesCard />

        <OrderRulesCard />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateRewardRules.isPending}
          >
            {updateRewardRules.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}