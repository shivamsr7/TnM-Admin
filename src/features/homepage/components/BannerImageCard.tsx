import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import SingleImageUploader from "@/shared/components/upload/SingleImageUploader";
import SettingCard from "@/features/settings/components/SettingCard";

import type { UseFormReturn } from "react-hook-form";
import type { BannerFormValues } from "../schemas/banner.schema";

interface BannerImageCardProps {
  form: UseFormReturn<BannerFormValues>;
}

export default function BannerImageCard({
  form,
}: BannerImageCardProps) {
  return (
    <SettingCard
      title="Banner Images"
      description="Upload desktop and mobile banner images."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="desktopImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desktop Banner *</FormLabel>

              <FormControl>
                <SingleImageUploader
                  title="Desktop Banner"
                  folder="homepage"
                  value={field.value ?? ""}
                  onChange={(url) =>
                    field.onChange(url ?? "")
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Banner</FormLabel>

              <FormControl>
                <SingleImageUploader
                  title="Mobile Banner"
                  folder="homepage"
                  value={field.value ?? ""}
                  onChange={(url) =>
                    field.onChange(url ?? "")
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SettingCard>
  );
}