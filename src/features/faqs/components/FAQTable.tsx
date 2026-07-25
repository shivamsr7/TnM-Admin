import type {
  Column
} from "@/components/shared/DataTable";

import DataTable from "@/components/shared/DataTable";

import StatusBadge from "@/components/shared/StatusBadge";

import ActionMenu from "@/shared/components/admin/ActionMenu";

import type {
  FAQ,
} from "../types/faq.types";


interface FAQTableProps {

  data: FAQ[];

  onEdit: (
    faq: FAQ
  ) => void;

  onDelete: (
    faq: FAQ
  ) => void;

}



export default function FAQTable({
  data,
  onEdit,
  onDelete,
}: FAQTableProps) {


  const columns: Column<FAQ>[] = [

    {
      key: "question",
      title: "Question",

      render: (value) => (

        <p className="max-w-md truncate font-medium">
          {String(value)}
        </p>

      ),
    },


    {
      key: "answer",
      title: "Answer",

      render: (value) => (

        <p className="max-w-lg truncate text-muted-foreground">
          {String(value)}
        </p>

      ),
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
          status={
            value
              ? "active"
              : "inactive"
          }
        />

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

      title="FAQs"

      description="Manage frequently asked questions."

      columns={columns}

      data={data}

      getRowKey={(row) =>
        row.id
      }

      emptyTitle="No FAQs"

      emptyDescription="Create your first FAQ."

    />

  );
}