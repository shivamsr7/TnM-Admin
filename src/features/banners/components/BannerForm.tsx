import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerSchema } from "../schemas/banner.schema";
import { AnimatePresence, motion } from "framer-motion";
import type {
  Banner,
  BannerFormData,
  BannerPosition,
} from "../types/banner.types";
import { useState } from "react";

import MediaUploader, {
  type ProductImage,
} from "@/shared/components/media/MediaUploader";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
interface BannerFormProps {
  banner?: Banner | null;

  onSubmit: (
    values: BannerFormData
  ) => void | Promise<void>;

  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;

  onUploadsChange?: (paths: string[]) => void;
}

export default function BannerForm({
  banner,
  onSubmit,
  step,
  setStep,
  onUploadsChange,
}: BannerFormProps) {
  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),

    defaultValues: {
      title: "",
      subtitle: "",

      image_url: "",
      mobile_image_url: "",

      button_text: "",
      button_link: "",

      position: "Homepage Hero" as BannerPosition,

      display_order: 0,

      starts_at: null,
      ends_at: null,

      is_active: true,
  image_path: "",
  mobile_image_path:"",
    },
  });

  const [desktopImages, setDesktopImages] =
  useState<ProductImage[]>([]);

const [mobileImages, setMobileImages] =
  useState<ProductImage[]>([]);

const originalPaths = useMemo(
  () =>
    new Set(
      [
        banner?.image_path,
        banner?.mobile_image_path,
      ].filter(Boolean)
    ),
  [banner]
);

useEffect(() => {
  const paths = [
    ...desktopImages,
    ...mobileImages,
  ]
    .map((image) => image.path)
    .filter(
      (path): path is string =>
        Boolean(path) && !originalPaths.has(path)
    );

  onUploadsChange?.(paths);
}, [
  desktopImages,
  mobileImages,
  originalPaths,
  onUploadsChange,
]);

  useEffect(() => {
    if (!banner) return;

    form.reset({
      title: banner.title,
      subtitle: banner.subtitle,

       image_url: banner.image_url,
  image_path: banner.image_path,

  mobile_image_url: banner.mobile_image_url,
  mobile_image_path: banner.mobile_image_path,

      button_text: banner.button_text,
      button_link: banner.button_link,

      position: banner.position,

      display_order: banner.display_order,

      starts_at: banner.starts_at,
      ends_at: banner.ends_at,

      is_active: banner.is_active,
    });
    setDesktopImages(
  banner.image_url
    ? [
        {
          url: banner.image_url,
          path: banner.image_path,
          isCover: true,
          sortOrder: 0,
        },
      ]
    : []
);
form.setValue(
  "image_url",
  banner.image_url ?? ""
);
form.setValue("image_path", banner.image_path ?? "");
form.setValue(
  "mobile_image_path",
  banner.mobile_image_path ?? ""
);
setMobileImages(
  banner.mobile_image_url
    ? [
        {
          url: banner.mobile_image_url,
          path: banner.mobile_image_path,
          isCover: true,
          sortOrder: 0,
        },
      ]
    : []
);
form.setValue(
  "mobile_image_url",
  banner.mobile_image_url ?? ""
);
  }, [banner, form]);

const submit = async (values: BannerFormData) => {
  await onSubmit({
    ...values,

    image_url: desktopImages[0]?.url ?? "",
    image_path: desktopImages[0]?.path ?? "",

    mobile_image_url: mobileImages[0]?.url ?? "",
    mobile_image_path: mobileImages[0]?.path ?? "",
  });
};

  return (
    <form
  onSubmit={form.handleSubmit(
    submit,
    (errors) => {
      console.log(errors);
    }
  )}
>
  {/* Progress */}
  <div className="flex items-center justify-center gap-4">
    <div
      className={`h-2 w-24 rounded-full transition ${
        step === 1 ? "bg-black" : "bg-green-500"
      }`}
    />
    <div
      className={`h-2 w-24 rounded-full transition ${
        step === 2 ? "bg-black" : "bg-gray-300"
      }`}
    />
  </div>

  <AnimatePresence mode="wait">

    {step === 1 && (
      <motion.div
        key="step1"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Banner Title
            </label>

            <input
              {...form.register("title")}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Summer Sale"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Position
            </label>

            <select
              {...form.register("position")}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="Homepage Hero">
                Homepage Hero
              </option>

              <option value="Homepage Secondary">
                Homepage Secondary
              </option>

              <option value="Collection Banner">
                Collection Banner
              </option>

              <option value="Sale Banner">
                Sale Banner
              </option>

              <option value="Offer Strip">
                Offer Strip
              </option>

              <option value="Popup">
                Popup
              </option>
            </select>
          </div>

        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Subtitle
          </label>

          <textarea
            {...form.register("subtitle")}
            rows={3}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Button Text
            </label>

            <input
              {...form.register("button_text")}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Button Link
            </label>

            <input
              {...form.register("button_link")}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Display Order
            </label>

            <input
              type="number"
              {...form.register("display_order", {
                valueAsNumber: true,
              })}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">

            <input
              type="checkbox"
              {...form.register("is_active")}
            />

            <label className="text-sm font-medium">
              Active Banner
            </label>

          </div>

        </div>

        <div className="flex justify-end">

          <Button
  type="button"
  onClick={async () => {
    const valid = await form.trigger([
      "title",
      "subtitle",
      "position",
      "display_order",
      "button_text",
      "button_link",
      "is_active",
    ]);

    if (valid) {
      setStep(2);
    }
  }}
>
  Next
</Button>

        </div>

      </motion.div>
      
    )}
        {step === 2 && (
      <motion.div
        key="step2"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Desktop Banner */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Desktop Banner
            </label>

            <MediaUploader
  folder="banners/desktop"
  value={desktopImages}
onChange={(images) => {
  setDesktopImages(images);

  form.setValue(
    "image_url",
    images[0]?.url ?? "",
    {
      shouldValidate: true,
    }
  );

  form.setValue(
    "image_path",
    images[0]?.path ?? "",
    {
      shouldValidate: true,
    }
  );
}}
  maxImages={1}
  title="Desktop Banner"
  showCoverLabel={false}
  enableSorting={false}
/>
          </div>

          {/* Mobile Banner */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Mobile Banner
            </label>

            <MediaUploader
  folder="banners/mobile"
  value={mobileImages}
onChange={(images) => {
  setMobileImages(images);

  form.setValue(
    "mobile_image_url",
    images[0]?.url ?? "",
    {
      shouldValidate: true,
    }
  );

  form.setValue(
    "mobile_image_path",
    images[0]?.path ?? "",
    {
      shouldValidate: true,
    }
  );
}}
  maxImages={1}
  title="Mobile Banner"
  showCoverLabel={false}
  enableSorting={false}
/>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Start Date
            </label>

            <input
              type="datetime-local"
              {...form.register("starts_at")}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              End Date
            </label>

            <input
              type="datetime-local"
              {...form.register("ends_at")}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            ← Back
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => form.reset()}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Reset
            </button>

            <button
              type="submit"
              className="rounded-md bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              {banner ? "Update Banner" : "Create Banner"}
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</form>
  );
}