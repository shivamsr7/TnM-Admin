import { Pencil, Trash2 } from "lucide-react";
import ActionMenu from "@/shared/components/admin/ActionMenu";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";

import type { Category } from "../types/category.types";

interface CategoryTableProps {
  data: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({
  data,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const columns = [
    {
      key: "name" as keyof Category,
      title: "Category",
    },
    {
      key: "parent_id" as keyof Category,
      title: "Parent",
      render: (value: Category["parent_id"], row: Category) => {
        if (!value) return "-";

        const parent = data.find((item) => item.id === row.parent_id);

        return parent?.name ?? "-";
      },
    },
    {
      key: "sort_order" as keyof Category,
      title: "Sort",
    },
    {
      key: "is_active" as keyof Category,
      title: "Status",
      render: (value: Category["is_active"]) => (
        <StatusBadge
          status={value ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "id" as keyof Category,
      title: "Actions",
      render: (_: Category["id"], row: Category) => (
        <ActionMenu
  onEdit={() => onEdit(row)}
  onDelete={() => onDelete(row)}
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