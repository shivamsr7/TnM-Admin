import { useState } from "react";

import {
  Plus,
  MapPin,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import AddressTable from "./AddressTable";
import AddressDialog from "./AddressDialog";
import AddressConfirmDialog from "./AddressConfirmDialog";

import {
  useCustomerAddresses,
} from "../hooks/useAddresses";

import {
  useSetDefaultAddress,
  useDeleteAddress,
} from "../hooks/useAddressMutations";

import type {
  CustomerAddress,
} from "../types/address.types";



interface CustomerAddressesProps {

  customerId: string;

}



export default function CustomerAddresses({
  customerId,
}: CustomerAddressesProps) {


  const {
    data: addresses = [],
    isLoading,
  } = useCustomerAddresses(customerId);



  const setDefaultMutation =
    useSetDefaultAddress();


  const deleteMutation =
    useDeleteAddress();



  const [dialogOpen, setDialogOpen] =
    useState(false);


  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddress | null>(null);



  const [deleteOpen, setDeleteOpen] =
    useState(false);


  const [deleteAddress, setDeleteAddress] =
    useState<CustomerAddress | null>(null);




  const handleAdd = () => {

    setSelectedAddress(null);

    setDialogOpen(true);

  };



  const handleEdit = (
    address: CustomerAddress
  ) => {

    setSelectedAddress(address);

    setDialogOpen(true);

  };



  const handleSetDefault = (
    address: CustomerAddress
  ) => {

    setDefaultMutation.mutate({

      customerId,

      addressId: address.id,

    });

  };



  const handleDelete = (
    address: CustomerAddress
  ) => {

    setDeleteAddress(address);

    setDeleteOpen(true);

  };



  const confirmDelete = () => {

    if (!deleteAddress) return;


    deleteMutation.mutate(
      deleteAddress.id,
      {
        onSuccess: () => {

          setDeleteOpen(false);

          setDeleteAddress(null);

        },
      }
    );

  };



  return (

    <div className="space-y-6">


      {/* Header */}

      <div className="flex items-center justify-between">


        <div>

          <div className="flex items-center gap-2">

            <h2 className="text-xl font-semibold">
              Saved Addresses
            </h2>


            <span className="rounded-full bg-muted px-3 py-1 text-sm">
              {addresses.length}
            </span>

          </div>


          <p className="text-sm text-muted-foreground">
            Manage customer's delivery addresses.
          </p>

        </div>



        <Button
          onClick={handleAdd}
        >

          <Plus className="mr-2 h-4 w-4" />

          Add Address

        </Button>


      </div>





      {/* Loading */}

      {isLoading && (

        <div className="flex h-48 items-center justify-center rounded-xl border">

          <div className="flex flex-col items-center gap-3">

            <Loader2
              className="h-7 w-7 animate-spin"
            />


            <p className="text-sm text-muted-foreground">
              Loading addresses...
            </p>


          </div>

        </div>

      )}






      {/* Empty */}

      {!isLoading &&
        addresses.length === 0 && (

        <div className="flex h-64 flex-col items-center justify-center rounded-xl border text-center">


          <div className="mb-4 rounded-full bg-muted p-4">

            <MapPin
              className="h-8 w-8 text-muted-foreground"
            />

          </div>


          <h3 className="font-semibold">
            No saved addresses
          </h3>


          <p className="mt-1 text-sm text-muted-foreground">
            Add an address to manage customer deliveries.
          </p>


          <Button
            className="mt-4"
            onClick={handleAdd}
          >

            <Plus className="mr-2 h-4 w-4" />

            Add Address

          </Button>


        </div>

      )}






      {/* Table */}

      {!isLoading &&
        addresses.length > 0 && (

        <AddressTable

          data={addresses}

          onEdit={handleEdit}

          onDelete={handleDelete}

          onSetDefault={handleSetDefault}

        />

      )}






      <AddressDialog

        open={dialogOpen}

        onOpenChange={setDialogOpen}

        customerId={customerId}

        address={selectedAddress}

      />





      <AddressConfirmDialog

        open={deleteOpen}

        onOpenChange={setDeleteOpen}

        loading={
          deleteMutation.isPending
        }

        onConfirm={confirmDelete}

      />



    </div>

  );

}