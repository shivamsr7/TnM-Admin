import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CustomerSchema } from "@/features/customers/schemas/customer.schema";

interface StatusSectionProps {
  form: UseFormReturn<CustomerSchema>;
}

export default function StatusSection({
  form,
}: StatusSectionProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Customer Status
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose whether this customer is active or blocked.
        </p>
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem value="active">
                  Active
                </SelectItem>

                <SelectItem value="blocked">
                  Blocked
                </SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}