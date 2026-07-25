import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import SettingCard from "@/features/settings/components/SettingCard";

import type { UseFormReturn } from "react-hook-form";
import type { BannerFormValues } from "../schemas/banner.schema";

interface BannerBasicInfoCardProps {
  form: UseFormReturn<BannerFormValues>;
}

export default function BannerBasicInfoCard({
  form,
}: BannerBasicInfoCardProps) {
  return (
    <SettingCard
      title="Banner Information"
      description="Configure the content displayed on the homepage banner."
    >
      <div className="grid gap-6">
        {/* Title */}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>

              <FormControl>
                <Input
                  placeholder="Summer Collection"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subtitle */}

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>

              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Discover our latest collection..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Button Text */}

          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Text</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Shop Now"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button Link */}

          <FormField
            control={form.control}
            name="buttonLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Link</FormLabel>

                <FormControl>
                  <Input
                    placeholder="/shop"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </SettingCard>
  );
}