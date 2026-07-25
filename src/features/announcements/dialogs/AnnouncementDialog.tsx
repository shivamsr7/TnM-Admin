import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";

import type {
  Announcement,
  AnnouncementInput,
} from "../types/announcements.types";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  announcement: Announcement | null;

  onSubmit: (
    values: AnnouncementInput
  ) => Promise<void>;
}

export default function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSubmit,
}: AnnouncementDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<AnnouncementInput>({
    defaultValues: {
      message: "",
      display_order: 1,
      is_active: true,
    },
  });

  useEffect(() => {
    if (announcement) {
      reset({
        message: announcement.message,
        display_order:
          announcement.display_order,
        is_active: announcement.is_active,
      });
    } else {
      reset({
        message: "",
        display_order: 1,
        is_active: true,
      });
    }
  }, [announcement, reset]);

  const isActive = watch("is_active");

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {announcement
              ? "Edit Announcement"
              : "Add Announcement"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label>
              Announcement Message
            </Label>

            <Input
              placeholder="Flat 20% Off this Weekend..."
              {...register("message", {
                required:
                  "Message is required",
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Display Order</Label>

            <Input
              type="number"
              min={1}
              {...register(
                "display_order",
                {
                  valueAsNumber: true,
                }
              )}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Active</Label>

              <p className="text-sm text-muted-foreground">
                Show this announcement
                on the storefront.
              </p>
            </div>

            <Switch
              checked={isActive}
              onCheckedChange={(value) =>
                setValue(
                  "is_active",
                  value
                )
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {announcement
                ? "Update"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}