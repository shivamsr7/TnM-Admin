import { useEffect,useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  useAddPoints,
  useDeductPoints,
} from "../hooks";

interface RewardPointsDialogProps {
  mode: "add" | "deduct";
  customerId: string;
  trigger: React.ReactNode;
}

interface FormValues {
  points: number;
  description: string;
}

export default function RewardPointsDialog({
  mode,
  customerId,
  trigger,
}: RewardPointsDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      points: 0,
      description: "",
    },
  });

  const addMutation = useAddPoints();
  const deductMutation = useDeductPoints();
const [open, setOpen] = useState(false);
  const loading =
    addMutation.isPending ||
    deductMutation.isPending;

  useEffect(() => {
    if (
      addMutation.isSuccess ||
      deductMutation.isSuccess
    ) {
      form.reset();
    }
  }, [
    addMutation.isSuccess,
    deductMutation.isSuccess,
    form,
  ]);

 const onSubmit = form.handleSubmit(async (values) => {
  try {
    if (mode === "add") {
      await addMutation.mutateAsync({
        customerId,
        points: values.points,
        description: values.description,
      });

      toast.success(
        `${values.points} reward points added successfully.`
      );
    } else {
      await deductMutation.mutateAsync({
        customerId,
        points: values.points,
        description: values.description,
      });

      toast.success(
        `${values.points} reward points deducted successfully.`
      );
    }

    form.reset();
    setOpen(false);
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to update reward points."
    );
  }
});

  return (
    <Dialog
  open={open}
  onOpenChange={setOpen}
>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add Reward Points"
              : "Deduct Reward Points"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>Points</Label>

            <Input
              type="number"
              min={1}
              {...form.register("points", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <Input
              placeholder="Reason for adjustment"
              {...form.register(
                "description",
                {
                  required: true,
                }
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant={
              mode === "add"
                ? "default"
                : "destructive"
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {mode === "add" ? (
                  <Plus className="mr-2 h-4 w-4" />
                ) : (
                  <Minus className="mr-2 h-4 w-4" />
                )}

                {mode === "add"
                  ? "Add Points"
                  : "Deduct Points"}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}