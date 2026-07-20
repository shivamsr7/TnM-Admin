import DashboardHeader from "../components/DashboardHeader";
import DashboardSkeleton from "../components/DashboardSkeleton";
import StatsGrid from "../components/StatsGrid";

import { useDashboardStats } from "../hooks/useDashboardStats";
import SalesChart from "../components/SalesChart";
import RecentOrdersTable from "../components/RecentOrdersTable";
import QuickActions from "../components/QuickActions";
export default function DashboardPage() {
  const {
  isLoading,
  isFetching,
  error,
  refetch,
} = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">
          Failed to load dashboard
        </h2>

        <p className="mt-2 text-red-600">
          Something went wrong while loading dashboard analytics.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-6 rounded-xl bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        onRefresh={refetch}
        isRefreshing={isFetching}
      />

      <StatsGrid />

<div className="mt-6">
  <QuickActions />
</div>

<div className="mt-6">
  <SalesChart />
</div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Orders */}

        <RecentOrdersTable />

        {/* Top Products */}

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">
            Top Selling Products
          </h2>

          <p className="mt-2 text-gray-500">
            Coming in the next milestone.
          </p>
        </div>
      </div>

      {/* Low Stock */}

      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold">
          Low Stock Products
        </h2>

        <p className="mt-2 text-gray-500">
          Coming in the next milestone.
        </p>
      </div>
    </div>
  );
}