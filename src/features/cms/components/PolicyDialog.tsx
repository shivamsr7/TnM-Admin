import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PolicyForm from "./PolicyForm";

import {
  useCreatePolicy,
  useUpdatePolicy,
} from "../hooks/usePolicyMutations";

import type {
  Policy,
  PolicyFormData,
} from "../types/policy.types";


interface PolicyDialogProps {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  policy?: Policy | null;

}



export default function PolicyDialog({
  open,
  onOpenChange,
  policy,
}: PolicyDialogProps) {


  const createMutation =
    useCreatePolicy();


  const updateMutation =
    useUpdatePolicy();



  const isEditing =
    !!policy;



  const loading =
    createMutation.isPending ||
    updateMutation.isPending;




  const handleSubmit = async (
    data: PolicyFormData
  ) => {

    try {

      if (isEditing && policy) {

        await updateMutation.mutateAsync({
          id: policy.id,
          data,
        });


      } else {


        await createMutation.mutateAsync(
          data
        );

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
        className="max-h-[90vh] overflow-hidden sm:max-w-3xl"
      >


        <DialogHeader>

          <DialogTitle>

            {
              isEditing
                ? "Edit Policy"
                : "Add Policy"
            }

          </DialogTitle>

        </DialogHeader>




        <div className="max-h-[75vh] overflow-y-auto pr-2">

          <PolicyForm

            initialData={policy}

            loading={loading}

            onSubmit={handleSubmit}

          />

        </div>



      </DialogContent>


    </Dialog>

  );

}