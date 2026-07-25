import { Eye } from "lucide-react";
import { useMemo, useState } from "react";

import DataTable from "@/components/shared/DataTable";
import type { Column } from "@/components/shared/DataTable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Review } from "../types/review.types";

import ReviewStars from "./ReviewStars";
import ReviewStatusBadge from "./ReviewStatusBadge";
import ReviewDialog from "./ReviewDialog";

import {
  useDeleteReview,
  useUpdateReviewStatus,
} from "../hooks/useReviewMutations";

interface ReviewTableProps {
  reviews: Review[];
}

export default function ReviewTable({
  reviews,
}: ReviewTableProps) {
  const [selectedReview, setSelectedReview] =
    useState<Review | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [ratingFilter, setRatingFilter] =
    useState("all");

  const updateStatus =
    useUpdateReviewStatus();

  const deleteReview =
    useDeleteReview();

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const query = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        review.product?.name
          ?.toLowerCase()
          .includes(query) ||
        review.customer?.first_name
          ?.toLowerCase()
          .includes(query) ||
        review.customer?.last_name
          ?.toLowerCase()
          .includes(query) ||
        review.review
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        review.status === statusFilter;

      const matchesRating =
        ratingFilter === "all" ||
        review.rating ===
          Number(ratingFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRating
      );
    });
  }, [
    reviews,
    search,
    statusFilter,
    ratingFilter,
  ]);

  const openDialog = (
    review: Review
  ) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const columns: Column<Review>[] = [
    {
      key: "product",
      title: "Product",

      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.product?.product_images?.find(
                (img) =>
                  img.is_primary
              )?.image_url ??
              row.product
                ?.product_images?.[0]
                ?.image_url ??
              "/placeholder.png"
            }
            alt={row.product?.name}
            className="h-12 w-12 rounded-lg border object-cover"
          />

          <div>
            <p className="font-medium">
              {row.product?.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {row.product?.slug}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "customer",
      title: "Customer",

      render: (_, row) => (
        <div>
          <p className="font-medium">
            {row.customer
              ? `${row.customer.first_name} ${row.customer.last_name ?? ""}`
              : "-"}
          </p>
        </div>
      ),
    },

    {
      key: "rating",
      title: "Rating",

      render: (value) => (
        <ReviewStars
          rating={Number(value)}
        />
      ),
    },

    {
      key: "review",
      title: "Review",

      render: (value) => (
        <p className="max-w-xs truncate">
          {String(value)}
        </p>
      ),
    },

    {
      key: "status",
      title: "Status",

      render: (value) => (
        <ReviewStatusBadge
          status={
            value as Review["status"]
          }
        />
      ),
    },

    {
      key: "created_at",
      title: "Date",

      render: (value) =>
        new Date(
          value as string
        ).toLocaleDateString(),
    },

    {
      key: "id",
      title: "Actions",

      render: (_, row) => (
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            openDialog(row)
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search product, customer or review..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="md:max-w-sm"
        />

        <div className="flex gap-3">
          <Select
            value={statusFilter}
            onValueChange={
              setStatusFilter
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Status
              </SelectItem>

              <SelectItem value="pending">
                Pending
              </SelectItem>

              <SelectItem value="approved">
                Approved
              </SelectItem>

              <SelectItem value="rejected">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={ratingFilter}
            onValueChange={
              setRatingFilter
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Ratings
              </SelectItem>

              <SelectItem value="5">
                5 ★
              </SelectItem>

              <SelectItem value="4">
                4 ★
              </SelectItem>

              <SelectItem value="3">
                3 ★
              </SelectItem>

              <SelectItem value="2">
                2 ★
              </SelectItem>

              <SelectItem value="1">
                1 ★
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        title="Reviews"
        description="Manage customer reviews."
        columns={columns}
        data={filteredReviews}
        getRowKey={(row) => row.id}
        emptyTitle="No Reviews"
        emptyDescription="Customer reviews will appear here."
      />

      <ReviewDialog
        open={dialogOpen}
        onOpenChange={
          setDialogOpen
        }
        review={selectedReview}
        isLoading={
          updateStatus.isPending ||
          deleteReview.isPending
        }
        onApprove={(id) =>
          updateStatus.mutate({
            id,
            status: "approved",
          })
        }
        onReject={(id) =>
          updateStatus.mutate({
            id,
            status: "rejected",
          })
        }
        onDelete={(id) =>
          deleteReview.mutate(id)
        }
      />
    </>
  );
}