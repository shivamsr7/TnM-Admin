import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable, {
  type Column,
} from "@/components/shared/DataTable";

import type { Banner } from "../types/banner.types";

interface BannerTableProps {
  data: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
}

export default function BannerTable({
  data,
  onEdit,
  onDelete,
}: BannerTableProps) {
  const columns: Column<Banner>[] = [
   {
  key: "image_url",
  title: "Banner",
  render: (_, row) => (
    <img
      src={row.image_url}
      alt={row.title}
      className="h-14 w-24 rounded-md border object-cover"
    />
  ),
},
    {
      key: "title",
      title: "Title",
    },
    {
      key: "position",
      title: "Position",
    },
    {
      key: "display_order",
      title: "Order",
    },
    {
      key: "is_active",
      title: "Status",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "id",
      title: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row)}
          >
            Delete
          </Button>
        </div>
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