import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import SettingCard from "@/features/settings/components/SettingCard";

import type { UseFormReturn } from "react-hook-form";
import type { BannerFormValues } from "../schemas/banner.schema";

interface BannerSettingsCardProps {
  form: UseFormReturn<BannerFormValues>;
}

export default function BannerSettingsCard({
  form,
}: BannerSettingsCardProps) {
  return (
    <SettingCard
      title="Banner Settings"
      description="Control banner visibility and display order."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min={1}
                  value={String(field.value ?? 1)}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? 1
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex h-full flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <FormLabel>Active Banner</FormLabel>

                <p className="text-sm text-muted-foreground">
                  Show this banner on the homepage.
                </p>
              </div>

              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </SettingCard>
  );
}