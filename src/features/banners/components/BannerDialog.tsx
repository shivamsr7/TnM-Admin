import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BannerForm from "./BannerForm";
import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import {
  useCreateBanner,
  useUpdateBanner,
} from "../hooks/useBanners";
import { useMediaLifecycle } from "@/shared/hooks/useMediaLifecycle";
import type {
  Banner,
  BannerFormData,
} from "../types/banner.types";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
}

export default function BannerDialog({
  open,
  onOpenChange,
  banner,
}: BannerDialogProps) {
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
const media = useMediaLifecycle();
  const [step, setStep] = useState(1);
const [showDiscardDialog, setShowDiscardDialog] =
  useState(false);
  useEffect(() => {
    if (open) {
      setStep(1);
    } else {
      setStep(1);
    }
  }, [open]);

  const loading =
    createBanner.isPending || updateBanner.isPending;
const originalDesktopPath = banner?.image_path;
const originalMobilePath = banner?.mobile_image_path;
const handleSubmit = async (values: BannerFormData) => {
  try {
    if (banner) {
      await updateBanner.mutateAsync({
        id: banner.id,
        values,
      });

      await media.cleanupReplacedFiles(
        [
          originalDesktopPath,
          originalMobilePath,
        ],
        [
          values.image_path,
          values.mobile_image_path,
        ]
      );
    } else {
      await createBanner.mutateAsync(values);
    }

    media.setSaved(true);

    onOpenChange(false);
  } catch (error) {
    console.error(error);
  }
};

const handleDiscard = async () => {
  await media.cleanupUploads();

  media.resetLifecycle();

  setShowDiscardDialog(false);

  onOpenChange(false);
};
const handleOpenChange = (value: boolean) => {
  if (loading) return;

  if (!value) {
    // If nothing to discard, close immediately
    if (media.saved || media.uploadedPaths.length === 0) {
      onOpenChange(false);
      return;
    }

    // Otherwise ask for confirmation
    setShowDiscardDialog(true);
    return;
  }

  onOpenChange(true);
};
return (
  <>
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>
            {banner ? "Edit Banner" : "Create Banner"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <BannerForm
            step={step}
            setStep={setStep}
            banner={banner}
            onSubmit={handleSubmit}
            onUploadsChange={media.setUploadedPaths}
          />
        </div>
      </DialogContent>
    </Dialog>

    <DeleteDialog
      open={showDiscardDialog}
      onOpenChange={setShowDiscardDialog}
      title="Discard Changes?"
      description="Your uploaded images and unsaved changes will be lost."
      confirmText="Discard"
      cancelText="Continue Editing"
      confirmVariant="destructive"
      onConfirm={handleDiscard}
    />
  </>
);
}