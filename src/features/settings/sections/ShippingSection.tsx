import SettingSection from "../components/SettingSection";
import ShippingCard from "../cards/ShippingCard";

export default function ShippingSection() {
  return (
    <SettingSection
      title="Shipping"
      description="Configure shipping charges and delivery settings."
    >
      <ShippingCard />
    </SettingSection>
  );
}