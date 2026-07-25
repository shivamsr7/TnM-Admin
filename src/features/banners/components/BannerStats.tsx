import {
  Image,
  CheckCircle2,
  XCircle,
  Monitor,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import type { Banner } from "../types/banner.types";

interface BannerStatsProps {
  banners: Banner[];
}

export default function BannerStats({
  banners,
}: BannerStatsProps) {
  const total = banners.length;

  const active = banners.filter(
    (banner) => banner.is_active
  ).length;

  const inactive = total - active;

  const hero = banners.filter(
    (banner) => banner.position === "Homepage Hero"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Banners"
        value={total}
        icon={Image}
      />

      <StatsCard
        title="Active"
        value={active}
        icon={CheckCircle2}
        iconBgColor="bg-green-100 text-green-600"
      />

      <StatsCard
        title="Inactive"
        value={inactive}
        icon={XCircle}
        iconBgColor="bg-red-100 text-red-600"
      />

      <StatsCard
        title="Hero Banners"
        value={hero}
        icon={Monitor}
        iconBgColor="bg-blue-100 text-blue-600"
      />
    </div>
  );
}