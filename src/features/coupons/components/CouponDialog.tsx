import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CouponForm from "./CouponForm";

import {
  useCreateCoupon,
  useUpdateCoupon,
} from "../hooks/useCoupons";

import type {
  Coupon,
  CouponFormData,
} from "../types/coupon.types";

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
}

export default function CouponDialog({
  open,
  onOpenChange,
  coupon,
}: CouponDialogProps) {
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();

  const isEditing = !!coupon;

  const loading =
    createMutation.isPending ||
    updateMutation.isPending;

  const handleSubmit = async (
    data: CouponFormData
  ) => {
    try {
      if (isEditing && coupon) {
        await updateMutation.mutateAsync({
          id: coupon.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      onOpenChange(false);
    } catch {
      // Toast handled in mutation hooks
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Coupon"
              : "Create Coupon"}
          </DialogTitle>
        </DialogHeader>

        <CouponForm
          initialData={coupon}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}