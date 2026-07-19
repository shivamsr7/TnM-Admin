import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-gray-100",
}: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className={`rounded-lg p-3 ${iconBgColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}