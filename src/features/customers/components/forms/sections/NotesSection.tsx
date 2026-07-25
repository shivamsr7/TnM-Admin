import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import type { CustomerSchema } from "@/features/customers/schemas/customer.schema";

interface NotesSectionProps {
  form: UseFormReturn<CustomerSchema>;
}

export default function NotesSection({
  form,
}: NotesSectionProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Notes
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add any internal notes about this customer. These notes are only
          visible to administrators.
        </p>
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Notes</FormLabel>

            <FormControl>
              <Textarea
                placeholder="Write notes about this customer..."
                className="min-h-[140px] resize-none"
                maxLength={1000}
                {...field}
              />
            </FormControl>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Internal notes only.
              </p>

              <span className="text-xs text-muted-foreground">
                {(field.value?.length ?? 0)}/1000
              </span>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}