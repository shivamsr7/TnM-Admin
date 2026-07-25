import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface PolicyConfirmDialogProps {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  loading?: boolean;

  onConfirm: () => void;

}


export default function PolicyConfirmDialog({
  open,
  onOpenChange,
  loading = false,
  onConfirm,
}: PolicyConfirmDialogProps) {

  return (

    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Policy?
          </AlertDialogTitle>


          <AlertDialogDescription>
            Are you sure you want to delete this policy?
            This action cannot be undone.
          </AlertDialogDescription>

        </AlertDialogHeader>


        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>


          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >

            {loading
              ? "Deleting..."
              : "Delete"}

          </AlertDialogAction>


        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

  );
}