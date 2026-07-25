import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import BannerForm from "../forms/BannerForm";

import {
  bannerSchema,
  type BannerFormValues,
} from "../schemas/banner.schema";

import { useCreateBanner } from "../hooks/useCreateBanner";

interface CreateBannerDialogProps {
  children: React.ReactNode;
}

export default function CreateBannerDialog({
  children,
}: CreateBannerDialogProps) {
  const [open, setOpen] = useState(false);

  const createBanner = useCreateBanner();

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

  async function onSubmit(values: BannerFormValues) {
    await createBanner.mutateAsync(values);

    form.reset();

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
          <DialogTitle>Create Banner</DialogTitle>
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
            onClick={form.handleSubmit(onSubmit)}
            disabled={createBanner.isPending}
          >
            {createBanner.isPending
              ? "Creating..."
              : "Create Banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}