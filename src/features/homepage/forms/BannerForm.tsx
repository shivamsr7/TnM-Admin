import { Form } from "@/components/ui/form";

import BannerBasicInfoCard from "../components/BannerBasicInfoCard";
import BannerImageCard from "../components/BannerImageCard";
import BannerSettingsCard from "../components/BannerSettingsCard";

import type { UseFormReturn } from "react-hook-form";
import type { BannerFormValues } from "../schemas/banner.schema";

interface BannerFormProps {
  form: UseFormReturn<BannerFormValues>;
}

export default function BannerForm({
  form,
}: BannerFormProps) {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <BannerImageCard form={form} />

        <BannerBasicInfoCard form={form} />

        <BannerSettingsCard form={form} />
      </form>
    </Form>
  );
}