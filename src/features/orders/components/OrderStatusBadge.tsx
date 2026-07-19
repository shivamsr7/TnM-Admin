import type { OrderStatus } from "../types/order.types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 border border-yellow-200",

  confirmed:
    "bg-blue-100 text-blue-800 border border-blue-200",

  packed:
    "bg-purple-100 text-purple-800 border border-purple-200",

  shipped:
    "bg-indigo-100 text-indigo-800 border border-indigo-200",

  delivered:
    "bg-green-100 text-green-800 border border-green-200",

  cancelled:
    "bg-red-100 text-red-800 border border-red-200",

  returned:
    "bg-orange-100 text-orange-800 border border-orange-200",

  refunded:
    "bg-gray-100 text-gray-800 border border-gray-200",
};

const labels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {labels[status]}
    </span>
  );
}