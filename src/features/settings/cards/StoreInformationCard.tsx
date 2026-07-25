import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import SettingCard from "../components/SettingCard";

import type { UseFormReturn } from "react-hook-form";
import type { StoreSettingsFormValues } from "../schemas/settings.schema";

interface StoreInformationCardProps {
  form: UseFormReturn<StoreSettingsFormValues>;
}

export default function StoreInformationCard({
  form,
}: StoreInformationCardProps) {
  return (
    <SettingCard
      title="Store Information"
      description="Basic information displayed across your store."
    >
      <div className="grid gap-6">
        {/* Store Name */}

        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="TNM Jewels"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Store Description */}

        <FormField
          control={form.control}
          name="storeDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Description</FormLabel>

              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Describe your business..."
                  {...field}
                  value={field.value ?? ""}
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