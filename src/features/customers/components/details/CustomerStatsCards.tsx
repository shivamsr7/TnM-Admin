import {
  ShoppingBag,
  IndianRupee,
  Receipt,
  Clock,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

import type {
  CustomerAnalytics,
} from "../../types/customer.types";

interface CustomerStatsCardsProps {
  analytics: CustomerAnalytics;
}

export default function CustomerStatsCards({
  analytics,
}: CustomerStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Orders"
        value={analytics.totalOrders}
        icon={ShoppingBag}
        iconBgColor="bg-blue-100"
      />

      <StatsCard
        title="Lifetime Spend"
        value={`₹${analytics.totalSpent.toLocaleString()}`}
        icon={IndianRupee}
        iconBgColor="bg-green-100"
      />

      <StatsCard
        title="Average Order"
        value={`₹${analytics.averageOrderValue.toLocaleString()}`}
        icon={Receipt}
        iconBgColor="bg-purple-100"
      />

      <StatsCard
        title="Last Order"
        value={analytics.lastOrder ?? "Never"}
        icon={Clock}
        iconBgColor="bg-orange-100"
      />
    </div>
  );
}