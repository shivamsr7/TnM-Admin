import {
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
  RefreshCcw,
  MapPinned,
  CreditCard,
  FileText,
} from "lucide-react";

import { useOrderActivity } from "../hooks/useOrders";

interface Activity {
  id: string;
  event_type: string;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface Props {
  orderId: string;
}

const eventConfig: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
  }
> = {
  order_created: {
    icon: FileText,
    color: "bg-blue-100 text-blue-700",
  },

  status_changed: {
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
  },

  tracking_added: {
    icon: Truck,
    color: "bg-indigo-100 text-indigo-700",
  },

  tracking_updated: {
    icon: MapPinned,
    color: "bg-purple-100 text-purple-700",
  },

  payment_received: {
    icon: CreditCard,
    color: "bg-emerald-100 text-emerald-700",
  },

  payment_refunded: {
    icon: RefreshCcw,
    color: "bg-orange-100 text-orange-700",
  },

  order_cancelled: {
    icon: XCircle,
    color: "bg-red-100 text-red-700",
  },

  returned: {
    icon: RotateCcw,
    color: "bg-yellow-100 text-yellow-700",
  },

  refunded: {
    icon: PackageCheck,
    color: "bg-gray-100 text-gray-700",
  },
};

export default function ActivityTimeline({
  orderId,
}: Props) {
  const {
    data: activities = [],
    isLoading,
  } = useOrderActivity(orderId);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        Loading activity...
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">
          Activity Timeline
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Complete order history.
        </p>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center text-slate-500">
            No activity available.
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity, index) => {
              const config =
                eventConfig[activity.event_type] ??
                {
                  icon: Clock3,
                  color:
                    "bg-slate-100 text-slate-700",
                };

              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4"
                >
                  {index !==
                    activities.length - 1 && (
                    <div className="absolute left-5 top-10 h-full w-0.5 bg-slate-200" />
                  )}

                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${config.color}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {activity.title}
                    </h3>

                    {activity.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {activity.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(
                        activity.created_at
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}