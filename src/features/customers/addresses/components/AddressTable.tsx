import DataTable from "@/components/shared/DataTable";

import type {
  Column,
} from "@/components/shared/DataTable";

import StatusBadge from "@/components/shared/StatusBadge";

import ActionMenu from "@/shared/components/admin/ActionMenu";

import type {
  CustomerAddress,
} from "../types/address.types";


interface AddressTableProps {

  data: CustomerAddress[];

  onEdit: (
    address: CustomerAddress
  ) => void;


  onDelete: (
    address: CustomerAddress
  ) => void;


  onSetDefault: (
    address: CustomerAddress
  ) => void;

}



export default function AddressTable({
  data,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressTableProps) {


  const columns: Column<CustomerAddress>[] = [

    {
      key: "type",
      title: "Type",

      render: (value) => (

        <span className="capitalize">
          {String(value)}
        </span>

      ),
    },


    {
      key: "full_name",
      title: "Name",

      render: (value) => (

        <p className="font-medium">
          {String(value)}
        </p>

      ),
    },


    {
      key: "phone",
      title: "Phone",
    },


    {
      key: "city",
      title: "Location",

      render: (_, row) => (

        <div>

          <p>
            {row.city}, {row.state}
          </p>

          <p className="text-sm text-muted-foreground">
            {row.postal_code}
          </p>

        </div>

      ),
    },


    {
      key: "is_default",
      title: "Default",

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


          extraActions={
            !row.is_default
              ? [
                  {
                    label: "Set Default",
                    onClick: () =>
                      onSetDefault(row),
                  },
                ]
              : []
          }

        />

      ),
    },

  ];



  return (

    <DataTable

      title="Saved Addresses"

      description="Manage customer saved addresses."

      columns={columns}

      data={data}

      getRowKey={(row) =>
        row.id
      }

      emptyTitle="No Addresses"

      emptyDescription="Customer has no saved addresses."

    />

  );

}