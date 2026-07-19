import { CreditCard, Wallet } from "lucide-react";

import type { Order } from "../types/order.types";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentCardProps {
  order: Order;
}

export default function PaymentCard({
  order,
}: PaymentCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">
        Payment Details
      </h2>

      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-500" />

            <div>
              <p className="text-xs text-gray-500">
                Payment Method
              </p>

              <p className="font-medium capitalize">
                {order.payment_method.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Total Amount
            </p>

            <p className="mt-1 text-xl font-bold">
              ₹{order.total_amount.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Advance Paid
            </p>

            <p className="mt-1 text-xl font-bold text-green-600">
              ₹{order.advance_amount.toLocaleString()}
            </p>
          </div>

        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-orange-600" />

            <p className="font-medium text-orange-700">
              Remaining COD
            </p>
          </div>

          <p className="mt-2 text-2xl font-bold text-orange-700">
            ₹{order.remaining_amount.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">

          <div>
            <p className="text-sm font-medium">
              Advance Payment
            </p>

            <p className="text-xs text-gray-500">
              Online Payment
            </p>
          </div>

          <PaymentStatusBadge
            status={order.advance_payment_status}
          />

        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">

          <div>
            <p className="text-sm font-medium">
              COD Collection
            </p>

            <p className="text-xs text-gray-500">
              Collect on Delivery
            </p>
          </div>

          <PaymentStatusBadge
            status={order.cod_payment_status}
          />

        </div>

      </div>
    </div>
  );
}