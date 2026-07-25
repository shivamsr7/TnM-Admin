import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import RewardTierForm from "./RewardTierForm";

import {
  useCreateRewardTier,
  useUpdateRewardTier,
} from "../hooks/useRewardTiers";

import type { RewardTier } from "../types";

interface Props {
  trigger?: React.ReactNode;
  initialData?: RewardTier;
}

export default function RewardTierDialog({
  trigger,
  initialData,
}: Props) {
  const [open, setOpen] = useState(false);

  const createTier = useCreateRewardTier();
  const updateTier = useUpdateRewardTier();

  const isEditing = !!initialData;

  const handleSubmit = async (values: any) => {
    if (isEditing) {
      await updateTier.mutateAsync({
        id: initialData.id,
        payload: values,
      });
    } else {
      await createTier.mutateAsync(values);
    }

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            Add Tier
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Reward Tier"
              : "Add Reward Tier"}
          </DialogTitle>
        </DialogHeader>

        <RewardTierForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={
            createTier.isPending ||
            updateTier.isPending
          }
        />
      </DialogContent>
    </Dialog>
  );
}