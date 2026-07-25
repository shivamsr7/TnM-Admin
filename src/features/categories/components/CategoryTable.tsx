import ActionMenu from "@/shared/components/admin/ActionMenu";
import DataTable, {
  type Column,
} from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";

import type { Category } from "../types/category.types";

import {
  FolderTree,
  ImageOff,
} from "lucide-react";

interface CategoryTableProps {
  data: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onManageSubcategories: (category: Category) => void;
}

export default function CategoryTable({
  data,
  onEdit,
  onDelete,
  onManageSubcategories,
}: CategoryTableProps) {
  const columns: Column<Category>[] = [
    {
      key: "image_url",
      title: "Image",
      render: (value) => {
        const image = value as string | null;

        if (!image) {
          return (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
              <ImageOff className="h-5 w-5 text-muted-foreground" />
            </div>
          );
        }

        return (
          <img
            src={image}
            alt="Category"
            className="h-12 w-12 rounded-lg border object-cover"
          />
        );
      },
    },

    {
      key: "name",
      title: "Category",
    },

    {
      key: "parent_id",
      title: "Parent",
      render: (value) => {
        const parentId = value as string | null;

        if (!parentId) return "-";

        const parent = data.find(
          (item) => item.id === parentId
        );

        return parent?.name ?? "-";
      },
    },

    {
      key: "sort_order",
      title: "Sort",
    },

    {
      key: "is_active",
      title: "Status",
      render: (value) => (
        <StatusBadge
          status={(value as boolean) ? "active" : "inactive"}
        />
      ),
    },

    {
      key: "id",
      title: "Actions",
      render: (_, row) => (
        <ActionMenu
          onEdit={() => onEdit(row)}
          onDelete={() => onDelete(row)}
          extraActions={[
            {
              label: "Manage Subcategories",
              icon: FolderTree,
              onClick: () =>
                onManageSubcategories(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
}