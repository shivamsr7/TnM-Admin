import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ReferralForm from "./ReferralForm";

import {
  useCreateReferral,
  useUpdateReferral,
} from "../hooks/useReferralMutations";

import type {
  CustomerReferral,
  ReferralFormData,
} from "../types/referral.types";


interface ReferralDialogProps {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  customerId: string;

  referral?: CustomerReferral | null;

}



export default function ReferralDialog({
  open,
  onOpenChange,
  customerId,
  referral,
}: ReferralDialogProps) {


  const createMutation =
    useCreateReferral();


  const updateMutation =
    useUpdateReferral();



  const isEditing =
    !!referral;



  const loading =
    createMutation.isPending ||
    updateMutation.isPending;



  const handleSubmit = async (
    data: ReferralFormData
  ) => {

    try {


      if (isEditing && referral) {

        await updateMutation.mutateAsync({

          id: referral.id,

          customerId,

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

      // toast handled in hooks

    }

  };



  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className="sm:max-w-md"
      >

        <DialogHeader>

          <DialogTitle>

            {
              isEditing
                ? "Edit Referral"
                : "Create Referral"
            }

          </DialogTitle>

        </DialogHeader>



        <ReferralForm

          initialData={referral}

          loading={loading}

          onSubmit={handleSubmit}

        />


      </DialogContent>


    </Dialog>

  );

}