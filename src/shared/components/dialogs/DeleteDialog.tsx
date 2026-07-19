import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  trigger?: React.ReactNode;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: string;
  description?: string;

  onConfirm: () => Promise<void>;

  isLoading?: boolean;
}

export default function DeleteDialog({
  trigger,
  open,
  onOpenChange,
  title = "Delete Item",
  description = "This action cannot be undone.",
  onConfirm,
  isLoading = false,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const deleting = loading || isLoading;

  const handleConfirm = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (deleting) return;

    try {
      setLoading(true);
      await onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {trigger && (
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}