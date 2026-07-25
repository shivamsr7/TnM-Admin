import {
  CheckCircle2,
  Clock3,
  MessageSquare,
  Star,
  XCircle,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

import type { ReviewStats as ReviewStatsType } from "../types/review.types";

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export default function ReviewStats({
  stats,
}: ReviewStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatsCard
        title="Total Reviews"
        value={stats.totalReviews}
        icon={MessageSquare}
        iconBgColor="bg-blue-100"
      />

      <StatsCard
        title="Approved"
        value={stats.approvedReviews}
        icon={CheckCircle2}
        iconBgColor="bg-green-100"
      />

      <StatsCard
        title="Pending"
        value={stats.pendingReviews}
        icon={Clock3}
        iconBgColor="bg-yellow-100"
      />

      <StatsCard
        title="Rejected"
        value={stats.rejectedReviews}
        icon={XCircle}
        iconBgColor="bg-red-100"
      />

      <StatsCard
        title="Average Rating"
        value={stats.averageRating.toFixed(1)}
        icon={Star}
        iconBgColor="bg-amber-100"
      />
    </div>
  );
}