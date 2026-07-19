import {
  Mail,
  Phone,
  User,
} from "lucide-react";

import type { Order } from "../types/order.types";

interface CustomerCardProps {
  order: Order;
}

export default function CustomerCard({
  order,
}: CustomerCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">
        Customer Details
      </h2>

      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <User className="h-5 w-5 text-gray-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Customer Name
            </p>

            <p className="font-medium">
              {order.customer_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <Mail className="h-5 w-5 text-gray-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Email
            </p>

            <p className="font-medium">
              {order.customer_email || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <Phone className="h-5 w-5 text-gray-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Phone
            </p>

            <p className="font-medium">
              {order.customer_phone}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}