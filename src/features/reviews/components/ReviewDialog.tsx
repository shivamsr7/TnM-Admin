import {
  Calendar,
  MessageSquare,
  ShoppingBag,
  User,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";

import ReviewConfirmDialog from "./ReviewConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { Review } from "../types/review.types";

import ReviewStars from "./ReviewStars";
import ReviewStatusBadge from "./ReviewStatusBadge";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  review: Review | null;

  isLoading: boolean;

  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReviewDialog({
  open,
  onOpenChange,
  review,
  isLoading,
  onApprove,
  onReject,
  onDelete,
}: ReviewDialogProps) {
  if (!review) return null;

  const image =
    review.product?.product_images?.find(
      (img) => img.is_primary
    )?.image_url ??
    review.product?.product_images?.[0]?.image_url ??
    "/placeholder.png";
const [confirmOpen, setConfirmOpen] =
  useState(false);

const [action, setAction] =
  useState<
    "approved" | "rejected" | "delete" | null
  >(null);
  return (
    <>
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Review Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Product */}

          <div className="flex gap-4">
            <img
              src={image}
              alt={review.product?.name}
              className="h-24 w-24 rounded-xl border object-cover"
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />

                <span className="font-semibold">
                  {review.product?.name}
                </span>
              </div>

              <ReviewStars
                rating={review.rating}
              />

              <ReviewStatusBadge
                status={review.status}
              />

              {review.is_verified && (
                <Badge
                  variant="secondary"
                  className="w-fit"
                >
                  <BadgeCheck className="mr-1 h-3 w-3" />
                  Verified Purchase
                </Badge>
              )}
            </div>
          </div>

          {/* Customer */}

          <div className="grid gap-4">

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />

              <span>
                {review.customer
                  ? `${review.customer.first_name} ${review.customer.last_name ?? ""}`
                  : "Guest Customer"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />

              <span>
                {new Date(
                  review.created_at
                ).toLocaleString()}
              </span>
            </div>

          </div>

          {/* Review */}

          <div className="rounded-xl border p-4 space-y-3">

            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />

              <span className="font-medium">
                Customer Review
              </span>
            </div>

            {review.title && (
              <h3 className="font-semibold">
                {review.title}
              </h3>
            )}

            <p className="text-sm leading-6 text-muted-foreground whitespace-pre-wrap">
              {review.review}
            </p>

          </div>

          {/* Footer */}

          <div className="flex flex-wrap justify-end gap-2">

           <Button
  variant="destructive"
  disabled={isLoading}
  onClick={() => {
    setAction("delete");
    setConfirmOpen(true);
  }}
>
  Delete
</Button>

            <Button
  variant="outline"
  disabled={isLoading}
  onClick={() => {
    setAction("rejected");
    setConfirmOpen(true);
  }}
>
  Reject
</Button>

            <Button
  disabled={isLoading}
  onClick={() => {
    setAction("approved");
    setConfirmOpen(true);
  }}
>
  Approve
</Button>

          </div>

        </div>
      </DialogContent>
    </Dialog>
    <ReviewConfirmDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      loading={isLoading}
      title="Confirm Action"
      description={
        action === "delete"
          ? "Are you sure you want to permanently delete this review?"
          : `Are you sure you want to ${action} this review?`
      }
      onConfirm={() => {
        if (!review || !action) return;

        switch (action) {
          case "approved":
            onApprove(review.id);
            break;

          case "rejected":
            onReject(review.id);
            break;

          case "delete":
            onDelete(review.id);
            break;
        }

        setConfirmOpen(false);
      }}
    />
  </>
  );
}