import { Badge } from "@/components/ui/badge";
import ActionMenu from "@/shared/components/admin/ActionMenu";
import DataTable, {
  type Column,
} from "@/components/shared/DataTable";

import type { Announcement } from "../types/announcements.types";

interface AnnouncementTableProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
  onToggleStatus: (announcement: Announcement) => void;
}

export default function AnnouncementTable({
  announcements,
  onEdit,
  onDelete,
  onToggleStatus,
}: AnnouncementTableProps) {
  const columns: Column<Announcement>[] = [
    {
      key: "message",
      title: "Message",
    },

    {
      key: "is_active",
      title: "Status",
      render: (_, row) => (
  <Badge variant={row.is_active ? "default" : "secondary"}>
    {row.is_active ? "Active" : "Inactive"}
  </Badge>
),
    },

    {
      key: "display_order",
      title: "Order",
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
        label: row.is_active ? "Disable" : "Enable",
        onClick: () => onToggleStatus(row),
      },
    ]}
  />
),
    },
  ];

  return (
    <DataTable
      title="Announcements"
      description="Manage the announcement bar displayed on the storefront."
      columns={columns}
      data={announcements}
      getRowKey={(row) => row.id}
      emptyIcon="📢"
      emptyTitle="No Announcements"
      emptyDescription="Create your first announcement to display on the storefront."
    />
  );
}