import { CalendarDays, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DashboardHeader({
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 17
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-8 flex flex-col gap-5 rounded-2xl border bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {greeting}
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome back to <span className="font-semibold">TNM Jewels Admin</span>.
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4" />

          <span>{today}</span>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          className={`h-4 w-4 ${
            isRefreshing ? "animate-spin" : ""
          }`}
        />

        Refresh
      </button>
    </div>
  );
}