import SettingSection from "../components/SettingSection";
import BrandingCard from "../cards/BrandingCard";

import { useSettingsContext } from "../context/SettingsContext";

export default function BrandingSection() {
  const { form } = useSettingsContext();

  return (
    <SettingSection
      title="Branding"
      description="Manage your store branding assets."
    >
      <BrandingCard form={form} />
    </SettingSection>
  );
}