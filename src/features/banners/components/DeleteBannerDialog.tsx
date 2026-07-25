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

import { useDeleteBanner } from "../hooks/useBanners";
import type { Banner } from "../types/banner.types";

interface DeleteBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
}

export default function DeleteBannerDialog({
  open,
  onOpenChange,
  banner,
}: DeleteBannerDialogProps) {
  const deleteBanner = useDeleteBanner();

  const handleDelete = async () => {
    if (!banner) return;

    try {
      await deleteBanner.mutateAsync(banner.id);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Banner
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{banner?.title}</strong>?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteBanner.isPending}
          >
            {deleteBanner.isPending
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}