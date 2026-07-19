import type {
  AdvancePaymentStatus,
  CodPaymentStatus,
} from "../types/order.types";

type PaymentStatus =
  | AdvancePaymentStatus
  | CodPaymentStatus;

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const statusStyles: Record<PaymentStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 border border-yellow-200",

  paid:
    "bg-green-100 text-green-800 border border-green-200",

  failed:
    "bg-red-100 text-red-800 border border-red-200",

  refunded:
    "bg-gray-100 text-gray-800 border border-gray-200",

  collected:
    "bg-blue-100 text-blue-800 border border-blue-200",
};

const labels: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  collected: "Collected",
};

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {labels[status]}
    </span>
  );
}