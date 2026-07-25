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

interface ReviewConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  loading?: boolean;

  onConfirm: () => void;
}

export default function ReviewConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  loading = false,
  onConfirm,
}: ReviewConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {loading ? "Processing..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}