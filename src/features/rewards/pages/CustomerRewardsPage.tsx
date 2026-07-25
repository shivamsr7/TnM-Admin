import { Users, Coins, TrendingUp, Wallet } from "lucide-react";

import CustomerRewardTable from "../components/CustomerRewardTable";
import { useCustomerRewards } from "../hooks";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerRewardsPage() {
  const { data = [], isLoading } =
    useCustomerRewards();

  const totalMembers = data.length;

  const outstandingPoints = data.reduce(
    (sum, wallet) => sum + wallet.current_points,
    0
  );

  const lifetimeEarned = data.reduce(
    (sum, wallet) => sum + wallet.lifetime_earned,
    0
  );

  const lifetimeRedeemed = data.reduce(
    (sum, wallet) => sum + wallet.lifetime_redeemed,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Customer Rewards
        </h1>

        <p className="text-muted-foreground">
          Manage customer reward wallets and
          transactions.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Reward Members"
          value={totalMembers}
          icon={Users}
        />

        <StatCard
          title="Outstanding Points"
          value={outstandingPoints}
          icon={Coins}
        />

        <StatCard
          title="Lifetime Earned"
          value={lifetimeEarned}
          icon={TrendingUp}
        />

        <StatCard
          title="Lifetime Redeemed"
          value={lifetimeRedeemed}
          icon={Wallet}
        />
      </div>

      {/* Table */}

      {isLoading ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          Loading...
        </div>
      ) : (
        <CustomerRewardTable />
      )}
    </div>
  );
}