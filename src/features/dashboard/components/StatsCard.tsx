import type { LucideIcon } from "lucide-react";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;

  iconBgColor?: string;

  loading?: boolean;

  subtitle?: string;

  growth?: number;

  trend?: "up" | "down";
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-gray-100",
  loading = false,
  subtitle,
  growth,
  trend = "up",
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
        <div className="h-4 w-24 rounded bg-gray-200" />

        <div className="mt-4 h-9 w-32 rounded bg-gray-200" />

        <div className="mt-4 h-4 w-40 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h2>

          {(subtitle || growth !== undefined) && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              {growth !== undefined && (
                <div
                  className={`flex items-center gap-1 font-semibold ${
                    trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}

                  {growth.toFixed(1)}%
                </div>
              )}

              {subtitle && (
                <span className="text-gray-500">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        <div
          className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${iconBgColor}`}
        >
          <Icon className="h-6 w-6 text-gray-800" />
        </div>
      </div>
    </div>
  );
}