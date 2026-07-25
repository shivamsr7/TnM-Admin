import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

import type { Customer } from "../types/customer.types";

interface CustomerStatsProps {
  customers: Customer[];
}

export default function CustomerStats({
  customers,
}: CustomerStatsProps) {
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "active"
  ).length;

  const blockedCustomers = customers.filter(
    (customer) => customer.status === "blocked"
  ).length;

  const now = new Date();

  const newCustomers = customers.filter((customer) => {
    const joined = new Date(customer.created_at);

    return (
      joined.getMonth() === now.getMonth() &&
      joined.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Customers"
        value={totalCustomers}
        icon={Users}
        iconBgColor="bg-blue-100"
      />

      <StatsCard
        title="Active Customers"
        value={activeCustomers}
        icon={UserCheck}
        iconBgColor="bg-green-100"
      />

      <StatsCard
        title="Blocked Customers"
        value={blockedCustomers}
        icon={UserX}
        iconBgColor="bg-red-100"
      />

      <StatsCard
        title="New This Month"
        value={newCustomers}
        icon={UserPlus}
        iconBgColor="bg-purple-100"
      />
    </div>
  );
}