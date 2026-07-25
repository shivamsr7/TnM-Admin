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

import { Input } from "@/components/ui/input";

import SettingCard from "../components/SettingCard";

import type { StoreSettingsFormValues } from "../schemas/settings.schema";

interface RegionalSettingsCardProps {
  form: UseFormReturn<StoreSettingsFormValues>;
}

const currencies = [
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
];

const languages = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
];

const timezones = [
  {
    value: "Asia/Kolkata",
    label: "Asia/Kolkata (GMT +05:30)",
  },
];

const dateFormats = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
];

const timeFormats = [
  "12 Hours",
  "24 Hours",
];

export default function RegionalSettingsCard({
  form,
}: RegionalSettingsCardProps) {
  return (
    <SettingCard
      title="Regional Settings"
      description="Configure your store's regional preferences."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Currency */}

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.value}
                      value={currency.value}
                    >
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currency Symbol */}

        <FormField
          control={form.control}
          name="currencySymbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency Symbol</FormLabel>

              <FormControl>
                <Input
                  placeholder="₹"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Timezone */}

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {timezones.map((timezone) => (
                    <SelectItem
                      key={timezone.value}
                      value={timezone.value}
                    >
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language */}

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem
                      key={language.value}
                      value={language.value}
                    >
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Format */}

        <FormField
          control={form.control}
          name="dateFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Date Format" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem
                      key={format}
                      value={format}
                    >
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Format */}

        <FormField
          control={form.control}
          name="timeFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Format</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Time Format" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {timeFormats.map((format) => (
                    <SelectItem
                      key={format}
                      value={format}
                    >
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SettingCard>
  );
}