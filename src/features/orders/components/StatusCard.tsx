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

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type {
  Order,
  OrderStatus,
} from "../types/order.types";

import {
  useUpdateOrderStatus,
} from "../hooks/useOrders";





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
    color:
      "bg-yellow-100 text-yellow-700",
    icon: Clock3,
    next: "confirmed",
    action: "Confirm Order",
  },

  confirmed: {
    label: "Confirmed",
    color:
      "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
    next: "packed",
    action: "Mark Packed",
  },

  packed: {
    label: "Packed",
    color:
      "bg-purple-100 text-purple-700",
    icon: Package,
    next: "shipped",
    action: "Mark Shipped",
  },

  shipped: {
    label: "Shipped",
    color:
      "bg-indigo-100 text-indigo-700",
    icon: Truck,
    next: "delivered",
    action: "Mark Delivered",
  },

  delivered: {
    label: "Delivered",
    color:
      "bg-green-100 text-green-700",
    icon: PackageCheck,
  },

  cancelled: {
    label: "Cancelled",
    color:
      "bg-red-100 text-red-700",
    icon: XCircle,
  },

  returned: {
    label: "Returned",
    color:
      "bg-orange-100 text-orange-700",
    icon: RotateCcw,
  },

  refunded: {
    label: "Refunded",
    color:
      "bg-gray-100 text-gray-700",
    icon: RefreshCcw,
  },

};





export default function StatusCard({
  order,
}: StatusCardProps) {

  const updateOrderStatus =
    useUpdateOrderStatus();





  const [
    showCancelDialog,
    setShowCancelDialog,
  ] = useState(false);





  const [
    cancellationReason,
    setCancellationReason,
  ] = useState("");





  const config =
    statusConfig[
      order.order_status
    ];





  const Icon =
    config.icon;





  const handleUpdateStatus =
    async () => {

      if (!config.next)
        return;





      try {

        await updateOrderStatus.mutateAsync({

          id:
            order.id,

          status:
            config.next,

        });





        toast.success(
          "Order status updated"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to update order status"
        );

      }

    };





  const handleCancelOrder =
    async () => {

      const reason =
        cancellationReason.trim();





      if (!reason) {

        toast.error(
          "Please enter a cancellation reason"
        );

        return;

      }





      try {

        await updateOrderStatus.mutateAsync({

          id:
            order.id,

          status:
            "cancelled",

          notes:
            reason,

        });





        setCancellationReason("");

        setShowCancelDialog(false);





        toast.success(
          "Order cancelled successfully"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to cancel order"
        );

      }

    };





  const canCancel =

    order.order_status !==
      "delivered" &&

    order.order_status !==
      "cancelled" &&

    order.order_status !==
      "returned" &&

    order.order_status !==
      "refunded";





  return (

    <>

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

              <span>

                {config.label}

              </span>

            </div>

          </div>





          <div>

            <p className="mb-2 text-sm text-slate-500">

              Created

            </p>





            <p className="font-medium">

              {new Date(

                order.created_at

              ).toLocaleString()}

            </p>

          </div>





          <div>

            <p className="mb-2 text-sm text-slate-500">

              Last Updated

            </p>





            <p className="font-medium">

              {new Date(

                order.updated_at

              ).toLocaleString()}

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

                onClick={
                  handleUpdateStatus
                }

                disabled={
                  updateOrderStatus.isPending
                }

              >

                {updateOrderStatus.isPending

                  ? "Updating..."

                  : config.action}

              </Button>

            </div>

          </div>

        )}

        {canCancel && (

          <div className="border-t p-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-sm font-medium text-red-600">

                  Cancel Order

                </p>





                <p className="mt-1 text-sm text-slate-500">

                  Cancel this order if it can no longer be fulfilled.

                </p>

              </div>





              <Button

                type="button"

                variant="destructive"

                onClick={() =>
                  setShowCancelDialog(true)
                }

                disabled={
                  updateOrderStatus.isPending
                }

              >

                <XCircle
                  size={17}
                  className="mr-2"
                />

                Cancel Order

              </Button>

            </div>

          </div>

        )}

      </div>





      {showCancelDialog && (

        <div

          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              setShowCancelDialog(false);

            }

          }}

        >

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="border-b p-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">

                  <XCircle size={20} />

                </div>





                <div>

                  <h3 className="text-lg font-semibold">

                    Cancel Order

                  </h3>





                  <p className="mt-1 text-sm text-slate-500">

                    Are you sure you want to cancel order{" "}

                    <span className="font-medium text-slate-700">

                      #{order.order_number}

                    </span>

                    ?

                  </p>

                </div>

              </div>

            </div>





            <div className="p-6">

              <label className="block text-sm font-medium text-slate-700">

                Cancellation Reason

              </label>





              <textarea

                value={
                  cancellationReason
                }

                onChange={(event) =>
                  setCancellationReason(
                    event.target.value
                  )
                }

                placeholder="Enter the reason for cancelling this order..."

                rows={4}

                className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"

              />





              <p className="mt-2 text-xs text-slate-400">

                This reason will be saved in the order status history.

              </p>

            </div>





            <div className="flex justify-end gap-3 border-t bg-slate-50 p-4">

              <Button

                type="button"

                variant="outline"

                onClick={() => {

                  setCancellationReason("");

                  setShowCancelDialog(false);

                }}

                disabled={
                  updateOrderStatus.isPending
                }

              >

                Keep Order

              </Button>





              <Button

                type="button"

                variant="destructive"

                onClick={
                  handleCancelOrder
                }

                disabled={

                  updateOrderStatus.isPending ||

                  !cancellationReason.trim()

                }

              >

                {updateOrderStatus.isPending

                  ? "Cancelling..."

                  : "Confirm Cancellation"}

              </Button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}