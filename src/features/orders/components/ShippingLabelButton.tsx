import { Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { generateShippingLabel } from "../utils/shippingLabel";

import type { Order } from "../types/order.types";

interface ShippingLabelButtonProps {
  order: Order;
}

export default function ShippingLabelButton({
  order,
}: ShippingLabelButtonProps) {
  const handleGenerate = async () => {
    try {
      await generateShippingLabel(order);

      toast.success(
        "Shipping label downloaded successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to generate shipping label."
      );
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGenerate}
      className="gap-2"
    >
      <Truck size={18} />

      Shipping Label
    </Button>
  );
}