import {
  Calendar,
  Mail,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NotifyConfirmDialog from "./NotifyConfirmDialog";
import type { NotifyRequest } from "../types/notify.types";

import NotifyStatusBadge from "./NotifyStatusBadge";

interface NotifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  request: NotifyRequest | null;

  onMarkNotified: (id: string) => void;
  onMarkPurchased: (id: string) => void;
  onCancel: (id: string) => void;
  isLoading: boolean;
}

export default function NotifyDialog({
  open,
  onOpenChange,
  request,
  onMarkNotified,
  onMarkPurchased,
  onCancel,
  isLoading
}: NotifyDialogProps) {
    const [confirmOpen, setConfirmOpen] =
  useState(false);

const [action, setAction] =
  useState<
    "notified" | "purchased" | "cancelled" | null
  >(null);
  if (!request) return null;

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">

        <DialogHeader>
          <DialogTitle>
            Notify Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Product */}

          <div className="flex gap-4">

            <img
  src={
    request.product?.product_images?.find(
      (img) => img.is_primary
    )?.image_url ??
    request.product?.product_images?.[0]?.image_url ??
    "/placeholder.png"
  }
  alt={request.product?.name}
  className="h-24 w-24 rounded-xl border object-cover"
/>

            <div className="space-y-2">

              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />

                <span className="font-semibold">
                  {request.product?.name}
                </span>
              </div>

              <NotifyStatusBadge
                status={request.status}
              />
            </div>

          </div>

          {/* Customer */}

          <div className="grid gap-4">

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />

              <span>{request.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />

              <span>{request.phone}</span>
            </div>

            {request.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />

                <span>{request.email}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />

              <span>
                {new Date(
                  request.requested_at
                ).toLocaleString()}
              </span>
            </div>

          </div>
<div className="space-y-3 border-t pt-4">

  <h4 className="text-sm font-semibold">
    Quick Actions
  </h4>

  <div className="grid grid-cols-2 gap-3">

    {request.product && (
      <Button
        asChild
        variant="outline"
      >
        <Link
  to={`/products/${request.product.id}`}
  onClick={() => onOpenChange(false)}
>
          <ExternalLink className="mr-2 h-4 w-4" />

          Open Product
        </Link>
      </Button>
    )}

    {request.customer && (
      <Button
        asChild
        variant="outline"
      >
        <Link
  to={`/customers/${request.customer.id}`}
  onClick={() => onOpenChange(false)}
>
          <ExternalLink className="mr-2 h-4 w-4" />

          Open Customer
        </Link>
      </Button>
    )}

  </div>

</div>
          {/* Footer */}

          <div className="flex flex-wrap justify-end gap-2">
  <Button
    variant="outline"
    disabled={isLoading}
    onClick={() => {
      setAction("cancelled");
      setConfirmOpen(true);
    }}
  >
    Cancel Request
  </Button>

  <Button
    variant="secondary"
    disabled={isLoading}
    onClick={() => {
      setAction("notified");
      setConfirmOpen(true);
    }}
  >
    Mark Notified
  </Button>

  <Button
    disabled={isLoading}
    onClick={() => {
      setAction("purchased");
      setConfirmOpen(true);
    }}
  >
    Mark Purchased
  </Button>
</div>

        </div>

      </DialogContent>
    </Dialog>
    <NotifyConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  loading={isLoading}
  title="Confirm Action"
  description={`Are you sure you want to mark this request as ${action}?`}
  onConfirm={() => {
    if (!request || !action) return;

    switch (action) {
      case "notified":
        onMarkNotified(request.id);
        break;

      case "purchased":
        onMarkPurchased(request.id);
        break;

      case "cancelled":
        onCancel(request.id);
        break;
    }

    setConfirmOpen(false);
  }}
/>
</>
  );
}