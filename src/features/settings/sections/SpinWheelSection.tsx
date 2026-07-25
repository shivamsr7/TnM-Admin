import SettingSection from "../components/SettingSection";
import SpinWheelGeneralCard from "../cards/SpinWheelGeneralCard";

export default function SpinWheelSection() {
  return (
    <SettingSection
      title="Spin Wheel"
      description="Manage your Spin Wheel campaign."
    >
      <SpinWheelGeneralCard />
    </SettingSection>
  );
}