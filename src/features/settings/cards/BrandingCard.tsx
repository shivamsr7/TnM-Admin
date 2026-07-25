import type { UseFormReturn } from "react-hook-form";

import SettingCard from "../components/SettingCard";

import type { StoreSettingsFormValues } from "../schemas/settings.schema";

import SingleImageUploader from "@/shared/components/upload/SingleImageUploader";

interface Props {
  form: UseFormReturn<StoreSettingsFormValues>;
}

export default function BrandingCard({
  form,
}: Props) {
  return (
    <SettingCard
      title="Brand Assets"
      description="Upload your store logo and favicon."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SingleImageUploader
          title="Store Logo"
          folder="branding/logo"
          value={form.watch("logo")}
          onChange={(url) =>
            form.setValue("logo", url, {
              shouldDirty: true,
            })
          }
        />

        <SingleImageUploader
          title="Favicon"
          folder="branding/favicon"
          value={form.watch("favicon")}
          onChange={(url) =>
            form.setValue("favicon", url, {
              shouldDirty: true,
            })
          }
        />
      </div>
    </SettingCard>
  );
}