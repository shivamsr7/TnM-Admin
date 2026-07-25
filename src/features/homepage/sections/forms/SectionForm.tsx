import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { sectionSchema } from "../schemas/section.schema";
import type { HomepageSection } from "../types/section.types";

type SectionFormInput = z.input<typeof sectionSchema>;
type SectionFormOutput = z.output<typeof sectionSchema>;

interface SectionFormProps {
  section: HomepageSection;
  isSubmitting?: boolean;
  onSubmit: (values: SectionFormOutput) => void;
  onCancel: () => void;
}

export default function SectionForm({
  section,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SectionFormProps) {
  const form = useForm<
  SectionFormInput,
  unknown,
  SectionFormOutput
>({
  resolver: zodResolver(sectionSchema),

    defaultValues: {
      title: section.title ?? "",
      subtitle: section.subtitle ?? "",
      is_enabled: section.is_enabled,
      settings: section.settings ?? {},
    },
  });

  useEffect(() => {
    form.reset({
      title: section.title ?? "",
      subtitle: section.subtitle ?? "",
      is_enabled: section.is_enabled,
      settings: section.settings ?? {},
    });
  }, [section, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input
                  placeholder="Section title"
                  value={field.value ?? ""}
                  onChange={field.onChange}
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
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>

              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Section subtitle"
                  value={field.value ?? ""}
                  onChange={field.onChange}
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
          name="is_enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <FormLabel>Enable Section</FormLabel>

              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}