
import ActionMenu from "@/shared/components/admin/ActionMenu";
import DataTable, { type Column } from "@/components/shared/DataTable";
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
  const columns: Column<Category>[] = [
    {
      key: "name" as keyof Category,
      title: "Category",
    },
    {
      key: "parent_id" as keyof Category,
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
      key: "sort_order" as keyof Category,
      title: "Sort",
    },
    {
      key: "is_active" as keyof Category,
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