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

  onConfirm: () => Promise<void> | void;

  isLoading?: boolean;

  confirmText?: string;
  cancelText?: string;

  confirmVariant?: "default" | "destructive";
}

export default function DeleteDialog({
  trigger,
  open,
  onOpenChange,
  title = "Delete Item",
  description = "This action cannot be undone.",
  onConfirm,
  isLoading = false,

  confirmText = "Delete",
  cancelText = "Cancel",

  confirmVariant = "destructive",
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const processing = loading || isLoading;

  const handleConfirm = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (processing) return;

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
          <AlertDialogCancel disabled={processing}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={processing}
            className={
              confirmVariant === "destructive"
                ? "bg-red-600 hover:bg-red-700"
                : undefined
            }
          >
            {processing ? `${confirmText}...` : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}