import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
  Ban,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";

interface Props {
  status: string;
}

const config: Record<
  string,
  {
    className: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    className: "bg-yellow-100 text-yellow-700",
    icon: Clock3,
  },
  confirmed: {
    className: "bg-blue-100 text-blue-700",
    icon: BadgeCheck,
  },
  packed: {
    className: "bg-purple-100 text-purple-700",
    icon: PackageCheck,
  },
  shipped: {
    className: "bg-indigo-100 text-indigo-700",
    icon: Truck,
  },
  delivered: {
    className: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  cancelled: {
    className: "bg-red-100 text-red-700",
    icon: Ban,
  },
  returned: {
    className: "bg-gray-100 text-gray-700",
    icon: RotateCcw,
  },
};

export default function StatusBadge({ status }: Props) {
  const item = config[status] ?? {
    className: "bg-gray-100 text-gray-700",
    icon: Clock3,
  };

  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      <Icon size={14} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}