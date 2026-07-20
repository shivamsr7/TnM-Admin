import {
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import StatsCard from "./StatsCard";
import { useDashboardStats } from "../hooks/useDashboardStats";

export default function StatsGrid() {
  const { data, isLoading } = useDashboardStats();

  const stats = data;

  const revenueGrowth = stats?.revenue.growth ?? 0;

  const cards = [
    {
      title: "Revenue",
      value: `₹${stats?.revenue.thisMonth.toLocaleString("en-IN") ?? 0}`,
      icon: IndianRupee,
      iconBgColor: "bg-green-100",
      growth: Math.abs(revenueGrowth),
      trend: revenueGrowth >= 0 ? "up" : "down",
      subtitle: "vs last month",
    },

    {
      title: "Orders",
      value: stats?.orders.total ?? 0,
      icon: ShoppingCart,
      iconBgColor: "bg-blue-100",
      subtitle: `${stats?.orders.pending ?? 0} Pending`,
    },

    {
      title: "Products",
      value: stats?.products.active ?? 0,
      icon: Package,
      iconBgColor: "bg-purple-100",
      subtitle: `${stats?.products.outOfStock ?? 0} Out of Stock`,
    },

    {
      title: "Customers",
      value: stats?.customers.total ?? 0,
      icon: Users,
      iconBgColor: "bg-orange-100",
      subtitle: "Unique Customers",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBgColor={card.iconBgColor}
          loading={isLoading}
          growth={card.growth}
          trend={card.trend as "up" | "down"}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  );
}