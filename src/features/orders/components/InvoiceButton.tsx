import { FileDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { generateInvoicePDF } from "../utils/invoice";

import type {
  Order,
  OrderItem,
} from "../types/order.types";

interface InvoiceButtonProps {
  order: Order;
  items: OrderItem[];
}

export default function InvoiceButton({
  order,
  items,
}: InvoiceButtonProps) {
  const handleDownload = async () => {
    try {
      await generateInvoicePDF(order, items);

      toast.success(
        "Invoice downloaded successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to generate invoice."
      );
    }
  };

  return (
    <Button
      onClick={handleDownload}
      className="gap-2"
    >
      <FileDown size={18} />

      Download Invoice
    </Button>
  );
}