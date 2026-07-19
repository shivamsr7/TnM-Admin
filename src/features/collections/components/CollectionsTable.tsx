import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import DataTable, {
  type Column,
} from "@/components/shared/DataTable";
import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

import { useDeleteCollection } from "../hooks/useCollections";

import type { Collection } from "../types/collection.types";

interface CollectionsTableProps {
  collections: Collection[];
  isLoading?: boolean;
}

export default function CollectionsTable({
  collections,
  isLoading = false,
}: CollectionsTableProps) {
  const deleteCollection = useDeleteCollection();

  if (isLoading) {
    return <LoadingSpinner text="Loading collections..." />;
  }

  const columns: Column<Collection>[] = [
    {
      key: "banner_image",
      title: "Banner",
      render: (value) => {
        const image = value as string;

        return image ? (
          <img
            src={image}
            alt="Collection"
            className="h-14 w-14 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
            No Image
          </div>
        );
      },
    },
    {
      key: "name",
      title: "Name",
    },
    {
      key: "slug",
      title: "Slug",
    },
    {
      key: "sort_order",
      title: "Sort Order",
    },
    {
      key: "is_active",
      title: "Status",
      render: (value) => (
        <StatusBadge status={value ? "active" : "inactive"} />
      ),
    },
    {
      key: "id",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link to={`/collections/${row.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>

          <DeleteDialog
            trigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Delete Collection"
            description={`Are you sure you want to delete "${row.name}"? This action cannot be undone.`}
            onConfirm={async () => {
              await deleteCollection.mutateAsync(row.id);
            }}
            isLoading={deleteCollection.isPending}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable<Collection>
      columns={columns}
      data={collections}
    />
  );
}