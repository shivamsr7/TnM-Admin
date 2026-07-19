import { PackageCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { generatePackingSlip } from "../utils/packingSlip";

import type {
  Order,
  OrderItem,
} from "../types/order.types";

interface PackingSlipButtonProps {
  order: Order;
  items: OrderItem[];
}

export default function PackingSlipButton({
  order,
  items,
}: PackingSlipButtonProps) {
  const handlePrint = async () => {
    try {
      await generatePackingSlip(order, items);

      toast.success(
        "Packing slip downloaded successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to generate packing slip."
      );
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handlePrint}
      className="gap-2"
    >
      <PackageCheck size={18} />
      Packing Slip
    </Button>
  );
}