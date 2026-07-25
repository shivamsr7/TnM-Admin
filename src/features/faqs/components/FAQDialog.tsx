import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FAQForm from "./FAQForm";

import {
  useCreateFAQ,
  useUpdateFAQ,
} from "../hooks/useFAQMutations";

import type {
  FAQ,
  FAQFormData,
} from "../types/faq.types";


interface FAQDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  faq?: FAQ | null;
}


export default function FAQDialog({
  open,
  onOpenChange,
  faq,
}: FAQDialogProps) {

  const createMutation =
    useCreateFAQ();


  const updateMutation =
    useUpdateFAQ();


  const isEditing = !!faq;


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;



  const handleSubmit = async (
    data: FAQFormData
  ) => {

    try {

      if (isEditing && faq) {

        await updateMutation.mutateAsync({
          id: faq.id,
          data,
        });

      } else {

        await createMutation.mutateAsync(
          data
        );

      }


      onOpenChange(false);


    } catch {
      // toast handled in mutation
    }

  };



  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className="max-h-[90vh] overflow-hidden sm:max-w-lg"
      >

        <DialogHeader>

          <DialogTitle>
            {isEditing
              ? "Edit FAQ"
              : "Add FAQ"}
          </DialogTitle>

        </DialogHeader>


        <div className="max-h-[75vh] overflow-y-auto pr-2">

          <FAQForm
            initialData={faq}
            loading={loading}
            onSubmit={handleSubmit}
          />

        </div>


      </DialogContent>


    </Dialog>
  );
}