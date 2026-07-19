import {
  MapPin,
  Phone,
  User,
  Home,
} from "lucide-react";

import type { Order } from "../types/order.types";

interface ShippingAddressCardProps {
  order: Order;
}

export default function ShippingAddressCard({
  order,
}: ShippingAddressCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">
        Shipping Address
      </h2>

      <div className="space-y-5">
        {/* Customer Name */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2">
            <User
              size={18}
              className="text-blue-600"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Recipient
            </p>

            <p className="font-medium text-slate-900">
              {order.shipping_full_name || "-"}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-green-50 p-2">
            <Phone
              size={18}
              className="text-green-600"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Phone Number
            </p>

            <p className="font-medium text-slate-900">
              {order.shipping_phone || "-"}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-orange-50 p-2">
            <Home
              size={18}
              className="text-orange-600"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Address
            </p>

            <p className="font-medium text-slate-900">
              {order.shipping_address || "-"}
            </p>

            {order.shipping_landmark && (
              <p className="mt-1 text-sm text-slate-600">
                {order.shipping_landmark}
              </p>
            )}
          </div>
        </div>

        {/* City / State / Pincode */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-purple-50 p-2">
            <MapPin
              size={18}
              className="text-purple-600"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Location
            </p>

            <p className="font-medium text-slate-900">
              {[
                order.shipping_city,
                order.shipping_state,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>

            <p className="text-slate-600">
              {order.shipping_pincode || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}