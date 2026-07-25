import { Eye } from "lucide-react";
import { useUpdateNotifyStatus } from "../hooks/useNotifyMutations";
import { useState } from "react";
import NotifyDialog from "./NotifyDialog";
import DataTable from "@/components/shared/DataTable";
import type { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  NotifyRequest,
} from "../types/notify.types";

import NotifyStatusBadge
  from "./NotifyStatusBadge";

interface NotifyTableProps {
  requests: NotifyRequest[];
}

export default function NotifyTable({
  requests,
}: NotifyTableProps) {
    const [selectedRequest, setSelectedRequest] =
  useState<NotifyRequest | null>(null);
const [search, setSearch] = useState("");

const [statusFilter, setStatusFilter] = useState("all");
const [dialogOpen, setDialogOpen] =
  useState(false);
  const filteredData = useMemo(() => {
  return requests.filter((row) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      row.name.toLowerCase().includes(query) ||
      row.phone.toLowerCase().includes(query) ||
      (row.email?.toLowerCase().includes(query) ?? false) ||
      (row.product?.name?.toLowerCase().includes(query) ?? false);

    const matchesStatus =
      statusFilter === "all" ||
      row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [requests, search, statusFilter]);
const updateStatus = useUpdateNotifyStatus();
const openDialog = (request: NotifyRequest) => {
  setSelectedRequest(request);
  setDialogOpen(true);
};
  const columns: Column<NotifyRequest>[] = [
    {
      key: "product",

      title: "Product",

      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
  src={
    row.product?.product_images?.find(
      (img) => img.is_primary
    )?.image_url ??
    row.product?.product_images?.[0]?.image_url ??
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
      key: "name",

      title: "Customer",

      render: (_, row) => (
        <div>
          <p className="font-medium">
            {row.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {row.phone}
          </p>
        </div>
      ),
    },

    {
      key: "email",

      title: "Email",
    },

    {
      key: "requested_at",

      title: "Requested",

      render: (value) =>
        new Date(
          value as string
        ).toLocaleDateString(),
    },

    {
      key: "status",

      title: "Status",

      render: (value) => (
        <NotifyStatusBadge
          status={
            value as NotifyRequest["status"]
          }
        />
      ),
    },

    {
      key: "id",

      title: "Actions",

      render: (_, row) => (
        <Button
  variant="ghost"
  size="icon"
  onClick={() => openDialog(row)}
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
        placeholder="Search customer, phone, email or product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="md:max-w-sm"
      />

      <Select
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="notified">Notified</SelectItem>
          <SelectItem value="purchased">Purchased</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <DataTable
      title="Notify Requests"
      description="Customers waiting for products to be restocked."
      columns={columns}
      data={filteredData}
      getRowKey={(row) => row.id}
      emptyTitle="No notify requests"
      emptyDescription="Customers will appear here once they request stock notifications."
    />

    <NotifyDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      request={selectedRequest}
      isLoading={updateStatus.isPending}
      onMarkNotified={(id) => {
        updateStatus.mutate(
          { id, status: "notified" },
          {
            onSuccess: () => {
              setDialogOpen(false);
              setSelectedRequest(null);
            },
          }
        );
      }}
      onMarkPurchased={(id) => {
        updateStatus.mutate(
          { id, status: "purchased" },
          {
            onSuccess: () => {
              setDialogOpen(false);
              setSelectedRequest(null);
            },
          }
        );
      }}
      onCancel={(id) => {
        updateStatus.mutate(
          { id, status: "cancelled" },
          {
            onSuccess: () => {
              setDialogOpen(false);
              setSelectedRequest(null);
            },
          }
        );
      }}
    />
  </>
);
}