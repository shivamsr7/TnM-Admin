import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import type { Order } from "../types/order.types";
import { useUpdateOrder } from "../hooks/useOrders";

interface StatusCardProps {
  order: Order;
}

export default function StatusCard({
  order,
}: StatusCardProps) {
  const updateOrder = useUpdateOrder();

  const updateStatus = async (
    status: Order["order_status"]
  ) => {
    await updateOrder.mutateAsync({
      id: order.id,
      updates: {
        order_status: status,
      },
    });

    toast.success("Order status updated");
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">
        Order Actions
      </h2>

      <div className="flex flex-wrap gap-3">

        {order.order_status === "pending" && (
          <Button
            onClick={() =>
              updateStatus("confirmed")
            }
          >
            Confirm Order
          </Button>
        )}

        {order.order_status === "confirmed" && (
          <Button
            onClick={() =>
              updateStatus("packed")
            }
          >
            Mark Packed
          </Button>
        )}

        {order.order_status === "packed" && (
          <Button
            onClick={() =>
              updateStatus("shipped")
            }
          >
            Mark Shipped
          </Button>
        )}

        {order.order_status === "shipped" && (
          <Button
            onClick={() =>
              updateStatus("delivered")
            }
          >
            Mark Delivered
          </Button>
        )}

      </div>
    </div>
  );
}