import { useState } from "react";
import { toast } from "sonner";
import { Truck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Order } from "../types/order.types";
import { useUpdateTracking } from "../hooks/useOrders";

interface TrackingCardProps {
  order: Order;
}

export default function TrackingCard({
  order,
}: TrackingCardProps) {
  const updateTracking = useUpdateTracking();

  const [courier, setCourier] = useState(
    order.courier_name ?? ""
  );

  const [tracking, setTracking] = useState(
    order.tracking_number ?? ""
  );

  const saveTracking = async () => {
    await updateTracking.mutateAsync({
      id: order.id,
      courier_name: courier,
      tracking_number: tracking,
    });

    toast.success("Tracking updated");
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Truck className="text-blue-600" />

        <h2 className="text-lg font-semibold">
          Courier & Tracking
        </h2>
      </div>

      <div className="space-y-4">

        <Input
          placeholder="Courier Name"
          value={courier}
          onChange={(e) =>
            setCourier(e.target.value)
          }
        />

        <Input
          placeholder="Tracking Number"
          value={tracking}
          onChange={(e) =>
            setTracking(e.target.value)
          }
        />

        <Button
          onClick={saveTracking}
          className="w-full"
          disabled={updateTracking.isPending}
        >
          {updateTracking.isPending
            ? "Saving..."
            : "Save Tracking"}
        </Button>

      </div>
    </div>
  );
}