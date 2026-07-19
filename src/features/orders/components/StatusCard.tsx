import {
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
  RefreshCcw,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import type {
  Order,
  OrderStatus,
} from "../types/order.types";

import { useUpdateOrderStatus } from "../hooks/useOrders";

interface StatusCardProps {
  order: Order;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    icon: React.ElementType;
    next?: OrderStatus;
    action?: string;
  }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock3,
    next: "confirmed",
    action: "Confirm Order",
  },

  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
    next: "packed",
    action: "Mark Packed",
  },

  packed: {
    label: "Packed",
    color: "bg-purple-100 text-purple-700",
    icon: Package,
    next: "shipped",
    action: "Mark Shipped",
  },

  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700",
    icon: Truck,
    next: "delivered",
    action: "Mark Delivered",
  },

  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: PackageCheck,
  },

  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },

  returned: {
    label: "Returned",
    color: "bg-orange-100 text-orange-700",
    icon: RotateCcw,
  },

  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-700",
    icon: RefreshCcw,
  },
};

export default function StatusCard({
  order,
}: StatusCardProps) {
  const updateOrderStatus = useUpdateOrderStatus();

  const config = statusConfig[order.order_status];
  const Icon = config.icon;

  const handleUpdateStatus = async () => {
    if (!config.next) return;

    try {
      await updateOrderStatus.mutateAsync({
        id: order.id,
        status: config.next,
      });

      toast.success("Order status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">
          Order Status
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage the current order workflow.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div>
          <p className="mb-2 text-sm text-slate-500">
            Current Status
          </p>

          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${config.color}`}
          >
            <Icon size={18} />
            <span>{config.label}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-500">
            Created
          </p>

          <p className="font-medium">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-500">
            Last Updated
          </p>

          <p className="font-medium">
            {new Date(order.updated_at).toLocaleString()}
          </p>
        </div>
      </div>

      {config.next && (
        <div className="border-t bg-slate-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Next Action
              </p>

              <p className="font-semibold">
                {config.action}
              </p>
            </div>

            <Button
              onClick={handleUpdateStatus}
              disabled={updateOrderStatus.isPending}
            >
              {updateOrderStatus.isPending
                ? "Updating..."
                : config.action}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}