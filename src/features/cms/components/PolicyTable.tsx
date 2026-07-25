import DataTable from "@/components/shared/DataTable";

import type {
  Column,
} from "@/components/shared/DataTable";

import StatusBadge from "@/components/shared/StatusBadge";

import ActionMenu from "@/shared/components/admin/ActionMenu";

import type {
  Policy,
} from "../types/policy.types";


interface PolicyTableProps {

  data: Policy[];

  onEdit: (
    policy: Policy
  ) => void;


  onDelete: (
    policy: Policy
  ) => void;

}



export default function PolicyTable({
  data,
  onEdit,
  onDelete,
}: PolicyTableProps) {


  const columns: Column<Policy>[] = [

    {
      key: "title",
      title: "Title",

      render: (value) => (

        <p className="font-medium">
          {String(value)}
        </p>

      ),
    },


    {
      key: "slug",
      title: "Slug",

      render: (value) => (

        <p className="text-muted-foreground">
          {String(value)}
        </p>

      ),
    },


    {
      key: "is_active",
      title: "Status",

      render: (value) => (

        <StatusBadge
          status={
            value
              ? "active"
              : "inactive"
          }
        />

      ),
    },


    {
      key: "updated_at",
      title: "Updated",

      render: (value) => (

        new Date(
          String(value)
        ).toLocaleDateString()

      ),
    },


    {
      key: "id",
      title: "Actions",

      render: (_, row) => (

        <ActionMenu

          onEdit={() =>
            onEdit(row)
          }

          onDelete={() =>
            onDelete(row)
          }

        />

      ),
    },

  ];



  return (

    <DataTable

      title="Policies"

      description="Manage website policies and CMS content."

      columns={columns}

      data={data}

      getRowKey={(row) =>
        row.id
      }

      emptyTitle="No Policies"

      emptyDescription="Create your first policy page."

    />

  );
}