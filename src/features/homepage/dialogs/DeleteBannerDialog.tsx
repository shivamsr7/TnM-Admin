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

import type { HomepageBanner } from "../types/homepage.types";
import { useDeleteBanner } from "../hooks/useDeleteBanner";

interface DeleteBannerDialogProps {
  banner: HomepageBanner;
  children: React.ReactNode;
}

export default function DeleteBannerDialog({
  banner,
  children,
}: DeleteBannerDialogProps) {
  const [open, setOpen] = useState(false);

  const deleteBanner = useDeleteBanner();

  async function handleDelete() {
    await deleteBanner.mutateAsync(banner.id);
    setOpen(false);
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Banner
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{banner.title}"
            </span>
            ?
            <br />
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
            className="bg-destructive hover:bg-destructive/90"
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