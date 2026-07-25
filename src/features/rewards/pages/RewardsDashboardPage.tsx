import { Gift, Trophy, Users, Wallet } from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

import { useRewardsDashboard } from "../hooks/useRewardsDashboard";
import RewardTransactionsTable from "../components/RewardTransactionsTable";

export default function RewardsDashboardPage() {
  const { data, isLoading } = useRewardsDashboard();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Outstanding Points"
          value={data?.outstandingPoints ?? 0}
          icon={Wallet}
          iconBgColor="bg-blue-100"
        />

        <StatsCard
          title="Lifetime Points"
          value={data?.lifetimePoints ?? 0}
          icon={Gift}
          iconBgColor="bg-green-100"
        />

        <StatsCard
          title="Redeemed Points"
          value={data?.redeemedPoints ?? 0}
          icon={Trophy}
          iconBgColor="bg-yellow-100"
        />

        <StatsCard
          title="Active Members"
          value={data?.activeMembers ?? 0}
          icon={Users}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Recent Transactions */}
      <RewardTransactionsTable
        transactions={data?.recentTransactions ?? []}
      />
    </div>
  );
}