import type { Order } from "../types/order.types";

interface OrderSummaryCardProps {
  order: Order;
}

export default function OrderSummaryCard({
  order,
}: OrderSummaryCardProps) {
  const giftWrapAmount =
    order.gift_wrap
      ? Number(order.gift_wrap_amount ?? 0)
      : 0;

  const calculatedTotal = Math.max(
    0,
    Number(order.subtotal ?? 0) -
      Number(order.discount ?? 0) +
      Number(order.shipping_charge ?? 0) +
      Number(order.tax ?? 0) +
      giftWrapAmount
  );

  const formatAmount = (amount: number) =>
    Number(amount ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
            ₹{formatAmount(order.subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Discount
          </span>

          <span className="font-medium text-green-600">
            - ₹{formatAmount(order.discount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Shipping
          </span>

          <span className="font-medium">
            ₹{formatAmount(order.shipping_charge)}
          </span>
        </div>

        {giftWrapAmount > 0 && (
          <div className="rounded-lg border border-[#C8A44D]/25 bg-[#C8A44D]/[0.06] px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">
                  🎁
                </span>

                <span className="font-medium text-gray-700">
                  Gift Wrap
                </span>
              </div>

              <span className="font-semibold text-[#A27B16]">
                ₹{formatAmount(giftWrapAmount)}
              </span>
            </div>

            {order.gift_message?.trim() && (
              <div className="mt-3 border-t border-[#C8A44D]/20 pt-3">
                <p className="text-xs font-medium text-gray-500">
                  Gift Message
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-700">
                  “{order.gift_message.trim()}”
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Tax
          </span>

          <span className="font-medium">
            ₹{formatAmount(order.tax)}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              Grand Total
            </span>

            <span className="text-2xl font-bold">
              ₹{formatAmount(calculatedTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
