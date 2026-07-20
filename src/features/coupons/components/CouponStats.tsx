import {
  BadgePercent,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

import type { Coupon } from "../types/coupon.types";

interface CouponStatsProps {
  coupons: Coupon[];
}

export default function CouponStats({
  coupons,
}: CouponStatsProps) {
  const totalCoupons = coupons.length;

  const activeCoupons = coupons.filter(
    (coupon) => coupon.is_active
  ).length;

  const expiredCoupons = coupons.filter((coupon) => {
    if (!coupon.expires_at) return false;

    return new Date(coupon.expires_at) < new Date();
  }).length;

  const totalUses = coupons.reduce(
    (total, coupon) => total + coupon.used_count,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Coupons"
        value={totalCoupons}
        icon={BadgePercent}
        iconBgColor="bg-blue-100"
      />

      <StatsCard
        title="Active Coupons"
        value={activeCoupons}
        icon={CheckCircle2}
        iconBgColor="bg-green-100"
      />

      <StatsCard
        title="Expired Coupons"
        value={expiredCoupons}
        icon={Clock3}
        iconBgColor="bg-red-100"
      />

      <StatsCard
        title="Total Uses"
        value={totalUses}
        icon={TrendingUp}
        iconBgColor="bg-purple-100"
      />
    </div>
  );
}