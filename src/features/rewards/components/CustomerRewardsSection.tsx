import {
  Crown,
  Gift,
  Trophy,
  Wallet,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

import LoadingSpinner from "@/shared/components/LoadingSpinner";

import { useCustomerRewards } from "../hooks";
import CustomerRewardHistory from "./CustomerRewardHistory";
interface Props {
  customerId: string;
}

export default function CustomerRewardsSection({
  customerId,
}: Props) {
  const { data, isLoading } =
    useCustomerRewards(customerId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        Customer has no reward wallet yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">
        Rewards
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Available"
          value={data.available_points}
          icon={Wallet}
          iconBgColor="bg-blue-100"
        />

        <StatsCard
          title="Lifetime"
          value={data.lifetime_points}
          icon={Gift}
          iconBgColor="bg-green-100"
        />

        <StatsCard
          title="Redeemed"
          value={data.redeemed_points}
          icon={Trophy}
          iconBgColor="bg-yellow-100"
        />

        <StatsCard
          title="Tier"
          value={data.tier}
          icon={Crown}
          iconBgColor="bg-purple-100"
        />
      </div>
      <CustomerRewardHistory
      customerId={customerId}
    />
    </div>
  );
}