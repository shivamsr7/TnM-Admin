import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AddressForm from "./AddressForm";

import {
  useCreateAddress,
  useUpdateAddress,
} from "../hooks/useAddressMutations";

import type {
  CustomerAddress,
  AddressFormData,
} from "../types/address.types";


interface AddressDialogProps {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  customerId: string;

  address?: CustomerAddress | null;

}


export default function AddressDialog({
  open,
  onOpenChange,
  customerId,
  address,
}: AddressDialogProps) {


  const createMutation =
    useCreateAddress();


  const updateMutation =
    useUpdateAddress();


  const isEditing =
    !!address;


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;



  const handleSubmit = async (
    data: AddressFormData
  ) => {

    try {

      if (isEditing && address) {

        await updateMutation.mutateAsync({
          id: address.id,
          data,
        });


      } else {

        await createMutation.mutateAsync({
          customerId,
          data,
        });

      }


      onOpenChange(false);


    } catch {

      // Toast handled in mutation hooks

    }

  };



  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className="max-h-[90vh] overflow-hidden sm:max-w-xl"
      >

        <DialogHeader>

          <DialogTitle>

            {isEditing
              ? "Edit Address"
              : "Add Address"}

          </DialogTitle>

        </DialogHeader>


        <div className="max-h-[75vh] overflow-y-auto pr-2">

          <AddressForm

            initialData={address}

            loading={loading}

            onSubmit={handleSubmit}

          />

        </div>


      </DialogContent>

    </Dialog>

  );

}