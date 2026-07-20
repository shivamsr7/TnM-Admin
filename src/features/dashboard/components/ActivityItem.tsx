import {
  Package,
  ShoppingBag,
  Users,
  TicketPercent,
  Image,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Activity } from "../types/dashboard.types";
import { formatRelativeTime } from "@/shared/utils/time";
interface ActivityItemProps {
  activity: Activity;
}

const activityConfig = {
  order: {
    icon: ShoppingBag,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  customer: {
    icon: Users,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
  product: {
    icon: Package,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  coupon: {
    icon: TicketPercent,
    bg: "bg-pink-100",
    color: "text-pink-600",
  },
  banner: {
    icon: Image,
    bg: "bg-cyan-100",
    color: "text-cyan-600",
  },
};

export default function ActivityItem({
  activity,
}: ActivityItemProps) {
  const navigate = useNavigate();

  const config = activityConfig[activity.type];
  const Icon = config.icon;

  return (
    <button
      onClick={() => navigate(activity.route)}
      className="group relative flex w-full items-start gap-4 rounded-xl p-3 text-left transition-all duration-200 hover:bg-gray-50"
    >
      {/* Timeline Line */}
      <div className="absolute left-[25px] top-12 h-full w-px bg-gray-200 group-last:hidden" />

      {/* Icon */}
      <div
        className={`relative z-10 rounded-full ${config.bg} p-3 transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className={`h-5 w-5 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">
          {activity.title}
        </h4>

        <p className="mt-1 text-sm text-gray-500">
          {activity.description}
        </p>

        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <Clock3 className="h-3.5 w-3.5" />
          <span>{formatRelativeTime(activity.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}