import { Loader2, MessageSquare } from "lucide-react";

import ReviewStats from "../components/ReviewStats";
import ReviewTable from "../components/ReviewTable";

import {
  useReviews,
  useReviewStats,
} from "../hooks/useReviews";

export default function ReviewsPage() {
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useReviews();

  const {
    data: stats,
    isLoading: statsLoading,
  } = useReviewStats();

  if (reviewsLoading || statsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <MessageSquare className="h-10 w-10 text-red-500" />

        <h2 className="text-xl font-semibold">
          Failed to load reviews
        </h2>

        <p className="text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reviews
        </h1>

        <p className="text-muted-foreground">
          Manage customer reviews and ratings.
        </p>
      </div>

      {stats && (
        <ReviewStats
          stats={stats}
        />
      )}

      <ReviewTable
        reviews={reviews}
      />

    </div>
  );
}