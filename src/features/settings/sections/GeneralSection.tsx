import { Form } from "@/components/ui/form";

import SettingSection from "../components/SettingSection";

import StoreInformationCard from "../cards/StoreInformationCard";
import RegionalSettingsCard from "../cards/RegionalSettingsCard";
import {
    useSettingsContext,
}
from "../context/SettingsContext";
export default function GeneralSection() {
  const {
    form,
    settingsQuery,
    updateMutation,
} = useSettingsContext();

  if (settingsQuery.isPending) {
    return (
      <div className="rounded-2xl border bg-white p-8">
        Loading...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
  onSubmit={form.handleSubmit((values) => {
    updateMutation.mutate(values);
  })}
>
        <SettingSection
          title="General Settings"
          description="Manage your store information and regional preferences."
        >
          <StoreInformationCard form={form} />

          <RegionalSettingsCard form={form} />
        </SettingSection>
      </form>
    </Form>
  );
}