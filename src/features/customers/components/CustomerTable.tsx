import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

import DataTable, {
  type Column,
} from "@/components/shared/DataTable";

import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import StatusBadge from "@/components/shared/StatusBadge";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { useDeleteCustomer } from "../hooks/useCustomers";

import type { Customer } from "../types/customer.types";

interface CustomersTableProps {
  customers: Customer[];
  isLoading?: boolean;
}

export default function CustomersTable({
  customers,
  isLoading = false,
}: CustomersTableProps) {
  const deleteCustomer = useDeleteCustomer();

  if (isLoading) {
    return <LoadingSpinner text="Loading customers..." />;
  }

  const columns: Column<Customer>[] = [
    {
      key: "avatar",
      title: "Customer",

      render: (_, row) => (
        <Link
          to={`/customers/${row.id}`}
          className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-muted"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.avatar ?? ""} />

            <AvatarFallback>
              {row.first_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium hover:underline">
              {`${row.first_name} ${row.last_name ?? ""}`.trim()}
            </p>

            <p className="text-xs text-muted-foreground">
              {row.phone || "-"}
            </p>
          </div>
        </Link>
      ),
    },

    {
  key: "email",
  title: "Email",
  render: (_value, row) => row.email || "-",
},

    {
      key: "status",
      title: "Status",

      render: (value) => (
        <StatusBadge
          status={value === "active" ? "active" : "inactive"}
        />
      ),
    },

    {
      key: "created_at",
      title: "Joined",

      render: (value) =>
        new Date(value as string).toLocaleDateString(),
    },

    {
      key: "id",
      title: "Actions",

      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link to={`/customers/${row.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="icon">
            <Link to={`/customers/${row.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>

          <DeleteDialog
            trigger={
              <Button
                variant="destructive"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Delete Customer"
            description={`Are you sure you want to delete "${row.first_name}"?`}
            onConfirm={async () => {
              await deleteCustomer.mutateAsync(row.id);
            }}
            isLoading={deleteCustomer.isPending}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable<Customer>
      columns={columns}
      data={customers}
    />
  );
}