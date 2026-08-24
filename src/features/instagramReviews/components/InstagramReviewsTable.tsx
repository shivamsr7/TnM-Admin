import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import DataTable, { type Column } from "@/components/shared/DataTable";
import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  useDeleteInstagramCustomerReview,
  useUpdateInstagramCustomerReview,
} from "../hooks/useInstagramCustomerReviews";
import type { InstagramCustomerReview } from "../types/instagramCustomerReview.types";

interface Props {
  reviews: InstagramCustomerReview[];
  isLoading?: boolean;
  onEdit: (review: InstagramCustomerReview) => void;
  onPreview: (review: InstagramCustomerReview) => void;
}

export default function InstagramReviewsTable({
  reviews,
  isLoading = false,
  onEdit,
  onPreview,
}: Props) {
  const updateReview = useUpdateInstagramCustomerReview();
  const deleteReview = useDeleteInstagramCustomerReview();

  if (isLoading) {
    return <LoadingSpinner text="Loading Instagram reviews..." />;
  }

  const columns: Column<InstagramCustomerReview>[] = [
    {
      key: "screenshot_url",
      title: "Screenshot",
      render: (value) => (
        <img
          src={String(value)}
          alt="Instagram review"
          className="h-20 w-14 rounded-lg border object-cover object-top"
        />
      ),
    },
    {
      key: "customer_name",
      title: "Customer",
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.customer_name}</p>
          {row.instagram_username && (
            <p className="text-xs text-muted-foreground">
              {row.instagram_username}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      title: "Rating",
      render: (value) => (
        <span className="text-amber-500">
          {"★".repeat(Number(value))}
        </span>
      ),
    },
    {
      key: "display_order",
      title: "Order",
    },
    {
      key: "is_published",
      title: "Published",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.is_published}
            onCheckedChange={(checked) =>
              updateReview.mutate({
                id: row.id,
                values: { is_published: checked },
              })
            }
          />
          <StatusBadge
            status={row.is_published ? "active" : "inactive"}
          />
        </div>
      ),
    },
    {
      key: "is_featured",
      title: "Featured",
      render: (_, row) => (
        <Switch
          checked={row.is_featured}
          onCheckedChange={(checked) =>
            updateReview.mutate({
              id: row.id,
              values: { is_featured: checked },
            })
          }
        />
      ),
    },
    {
      key: "id",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPreview(row)}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onEdit(row)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <DeleteDialog
            trigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Delete Instagram Review"
            description={`Are you sure you want to delete "${row.customer_name}"'s review?`}
            onConfirm={async () => {
              await deleteReview.mutateAsync(row.id);
            }}
            isLoading={deleteReview.isPending}
          />
        </div>
      ),
    },
  ];

  return <DataTable<InstagramCustomerReview> columns={columns} data={reviews} />;
}
