import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import type { CustomerSchema } from "@/features/customers/schemas/customer.schema";

interface ContactSectionProps {
  form: UseFormReturn<CustomerSchema>;
}

export default function ContactSection({
  form,
}: ContactSectionProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add the customer's contact details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>

              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number{" "}
                <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  autoComplete="tel"
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