import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import type {
  CustomerSchema,
} from "@/features/customers/schemas/customer.schema";

interface BasicInfoSectionProps {
  form: UseFormReturn<CustomerSchema>;
}

export default function BasicInfoSection({
  form,
}: BasicInfoSectionProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the customer's basic details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* First Name */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter first name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter last name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}