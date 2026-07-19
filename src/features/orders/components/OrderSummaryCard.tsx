import type { Order } from "../types/order.types";

interface OrderSummaryCardProps {
  order: Order;
}

export default function OrderSummaryCard({
  order,
}: OrderSummaryCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">
        Order Summary
      </h2>

      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Subtotal
          </span>

          <span className="font-medium">
            ₹{order.subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Discount
          </span>

          <span className="font-medium text-green-600">
            - ₹{order.discount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Shipping
          </span>

          <span className="font-medium">
            ₹{order.shipping_charge.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Tax
          </span>

          <span className="font-medium">
            ₹{order.tax.toLocaleString()}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              Grand Total
            </span>

            <span className="text-2xl font-bold">
              ₹{order.total_amount.toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}