import {
  Clock3,
 CheckCircle2,
  Package,
  Truck,
  PackageCheck,
} from "lucide-react";

import type {
  Order,
  OrderStatus,
} from "../types/order.types";

interface OrderTimelineProps {
  order: Order;
}

const steps: {
  status: OrderStatus;
  title: string;
  icon: React.ElementType;
}[] = [
  {
    status: "pending",
    title: "Pending",
    icon: Clock3,
  },
  {
    status: "confirmed",
    title: "Confirmed",
    icon: CheckCircle2,
  },
  {
    status: "packed",
    title: "Packed",
    icon: Package,
  },
  {
    status: "shipped",
    title: "Shipped",
    icon: Truck,
  },
  {
    status: "delivered",
    title: "Delivered",
    icon: PackageCheck,
  },
];

const cancelledStatuses: OrderStatus[] = [
  "cancelled",
  "returned",
  "refunded",
];

export default function OrderTimeline({
  order,
}: OrderTimelineProps) {
  if (cancelledStatuses.includes(order.order_status)) {
    return null;
  }

  const currentIndex = steps.findIndex(
    (step) => step.status === order.order_status
  );

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">
          Order Progress
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track the journey of this order.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[760px] items-start justify-between p-8">

          {steps.map((step, index) => {
            const Icon = step.icon;

            const completed = index < currentIndex;
            const current = index === currentIndex;

            return (
              <div
                key={step.status}
                className="relative flex flex-1 flex-col items-center"
              >
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-5 h-1 w-full ${
                      completed
                        ? "bg-green-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white transition-all
                  
                  ${
                    completed
                      ? "border-green-500 text-green-600"
                      : current
                      ? "border-blue-500 text-blue-600 shadow-lg"
                      : "border-slate-300 text-slate-400"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <div className="mt-4 text-center">
                  <p
                    className={`font-medium ${
                      completed || current
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {completed
                      ? "Completed"
                      : current
                      ? "Current"
                      : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}