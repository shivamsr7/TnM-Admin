import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CouponForm, {
  type CouponFormSubmitData,
} from "./CouponForm";

import {
  useCreateCoupon,
  useUpdateCoupon,
} from "../hooks/useCoupons";

import type {
  Coupon,
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
    payload: CouponFormSubmitData
  ) => {
    try {
      const rules = {
        targets: payload.targets,
        customerIds: payload.customerIds,
        membershipTierIds:
          payload.membershipTierIds,
      };

      if (isEditing && coupon) {
        await updateMutation.mutateAsync({
          id: coupon.id,
          data: payload.data,
          rules,
        });
      } else {
        await createMutation.mutateAsync({
          data: payload.data,
          rules,
        });
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex max-h-[90vh] flex-col">

  <DialogHeader className="border-b px-6 py-4">
    <DialogTitle>
      {isEditing
        ? "Edit Coupon"
        : "Create Coupon"}
    </DialogTitle>
  </DialogHeader>

  <div className="flex-1 overflow-y-auto px-6 py-5">
    <CouponForm
      initialData={coupon}
      loading={loading}
      onSubmit={handleSubmit}
    />
  </div>

</div>
      </DialogContent>
    </Dialog>
  );
}