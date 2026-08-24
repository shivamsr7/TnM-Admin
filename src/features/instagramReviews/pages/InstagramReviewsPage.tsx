import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/shared/components/admin/EmptyState";

import {
  useInstagramCustomerReviews,
} from "../hooks/useInstagramCustomerReviews";
import type { InstagramCustomerReview } from "../types/instagramCustomerReview.types";

import InstagramReviewsTable from "../components/InstagramReviewsTable";
import InstagramReviewDialog from "../components/InstagramReviewDialog";
import InstagramReviewPreviewDialog from "../components/InstagramReviewPreviewDialog";

export default function InstagramReviewsPage() {
  const { data: reviews = [], isLoading } = useInstagramCustomerReviews();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] =
    useState<InstagramCustomerReview | null>(null);
  const [previewReview, setPreviewReview] =
    useState<InstagramCustomerReview | null>(null);

  const orderedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) =>
          a.display_order - b.display_order ||
          new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
      ),
    [reviews]
  );

  function openCreate() {
    setSelectedReview(null);
    setFormOpen(true);
  }

  function openEdit(review: InstagramCustomerReview) {
    setSelectedReview(review);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instagram Reviews"
        description="Manage the Instagram DM reviews shown in Customer Love on the homepage."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Instagram Review
          </Button>
        }
      />

      {!isLoading && orderedReviews.length === 0 ? (
        <EmptyState
          title="No Instagram reviews yet"
          description="Add your first customer review from an Instagram DM."
          action={
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          }
        />
      ) : (
        <InstagramReviewsTable
          reviews={orderedReviews}
          isLoading={isLoading}
          onEdit={openEdit}
          onPreview={setPreviewReview}
        />
      )}

      <InstagramReviewDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        review={selectedReview}
      />

      <InstagramReviewPreviewDialog
        open={Boolean(previewReview)}
        onOpenChange={(open) => {
          if (!open) setPreviewReview(null);
        }}
        review={previewReview}
      />
    </div>
  );
}
