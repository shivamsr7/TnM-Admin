
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import DataTable, {
  type Column,
} from "@/components/shared/DataTable";

import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import StatusBadge from "@/components/shared/StatusBadge";

import { useDeleteTag } from "../hooks/useTags";
import type { Tag } from "../types/tag.types";

interface TagsTableProps {
  tags: Tag[];
  isLoading?: boolean;
}

export default function TagsTable({
  tags,

}: TagsTableProps) {
  const navigate = useNavigate();

  const deleteTag = useDeleteTag();

  const columns: Column<Tag>[] = [
  {
    key: "name",
    title: "Name",
    render: (_, tag) => (
      <div>
        <p className="font-medium">{tag.name}</p>

        {tag.description && (
          <p className="text-sm text-gray-500">
            {tag.description}
          </p>
        )}
      </div>
    ),
  },

  {
    key: "slug",
    title: "Slug",
  },

  {
    key: "sort_order",
    title: "Sort",
  },

  {
    key: "is_active",
    title: "Status",
    render: (_, tag) => (
      <StatusBadge
        status={tag.is_active ? "active" : "inactive"}
      />
    ),
  },

  {
    key: "created_at",
    title: "Created",
    render: (_, tag) =>
      tag.created_at
        ? new Date(tag.created_at).toLocaleDateString()
        : "-",
  },

  {
    key: "id",
    title: "Actions",
    render: (_, tag) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            navigate(`/tags/${tag.id}/edit`)
          }
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <DeleteDialog
          title="Delete Tag"
          description={`Delete "${tag.name}"?`}
          isLoading={deleteTag.isPending}
          onConfirm={() =>
            deleteTag.mutate(tag.id)
          }
          trigger={
            <Button
              variant="destructive"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </div>
        ),
      },
    ];

  return (
<DataTable<Tag>
  columns={columns}
  data={tags}
/>
  );
}