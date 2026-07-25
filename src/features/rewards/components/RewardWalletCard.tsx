import { Coins, Crown, TrendingUp, Gift, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { CustomerRewards } from "../types";

interface RewardWalletCardProps {
  wallet: CustomerRewards;
}

export default function RewardWalletCard({
  wallet,
}: RewardWalletCardProps) {
  const stats = [
    {
      title: "Current Points",
      value: wallet.current_points,
      icon: Coins,
    },
    {
      title: "Lifetime Earned",
      value: wallet.lifetime_earned,
      icon: TrendingUp,
    },
    {
      title: "Redeemed",
      value: wallet.lifetime_redeemed,
      icon: Gift,
    },
    {
      title: "Referrals",
      value: wallet.referral_count,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Customer */}

      <Card>
        <CardContent className="flex items-center justify-between py-6">
          <div>
            <h2 className="text-xl font-semibold">
              {wallet.customer?.first_name}{" "}
              {wallet.customer?.last_name}
            </h2>

            <p className="text-sm text-muted-foreground">
              {wallet.customer?.email}
            </p>

            <p className="text-sm text-muted-foreground">
              {wallet.customer?.phone}
            </p>
          </div>

          <div
            className="rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{
              backgroundColor:
                wallet.tier?.badge_color ?? "#6B7280",
            }}
          >
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4" />

              {wallet.tier?.tier_name ?? "No Tier"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between py-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {stat.value}
                  </h2>
                </div>

                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bonus Status */}

      <Card>
        <CardContent className="py-6">
          <h3 className="mb-4 font-semibold">
            Reward Status
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span>Welcome Bonus</span>

              <span
                className={
                  wallet.welcome_bonus_given
                    ? "font-medium text-green-600"
                    : "font-medium text-red-500"
                }
              >
                {wallet.welcome_bonus_given
                  ? "Given"
                  : "Pending"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <span>Birthday Bonus</span>

              <span
                className={
                  wallet.birthday_bonus_given
                    ? "font-medium text-green-600"
                    : "font-medium text-red-500"
                }
              >
                {wallet.birthday_bonus_given
                  ? "Given"
                  : "Pending"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}