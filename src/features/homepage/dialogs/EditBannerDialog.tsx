import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import BannerForm from "../forms/BannerForm";

import {
  bannerSchema,
  type BannerFormValues,
} from "../schemas/banner.schema";

import { useUpdateBanner } from "../hooks/useUpdateBanner";

import type { HomepageBanner } from "../types/homepage.types";

interface EditBannerDialogProps {
  banner: HomepageBanner;
  children: React.ReactNode;
}

export default function EditBannerDialog({
  banner,
  children,
}: EditBannerDialogProps) {
  const [open, setOpen] = useState(false);

  const updateBanner = useUpdateBanner();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),

    defaultValues: {
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      desktopImage: "",
      mobileImage: "",
      displayOrder: 1,
      isActive: true,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
  title: banner.title,
  subtitle: banner.subtitle ?? "",

  buttonText: banner.button_text ?? "",
  buttonLink: banner.button_link ?? "",

  desktopImage: banner.desktop_image ?? "",
  mobileImage: banner.mobile_image ?? "",

  displayOrder: banner.display_order ?? 1,
  isActive: banner.is_active ?? true,
});
  }, [open, banner, form]);

  async function onSubmit(values: BannerFormValues) {
    await updateBanner.mutateAsync({
      id: banner.id,
      values,
    });

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
        </DialogHeader>

        <BannerForm form={form} />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            disabled={updateBanner.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {updateBanner.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}