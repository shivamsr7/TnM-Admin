import SettingSection from "../components/SettingSection";
import SocialCard from "../cards/SocialCard";

export default function SocialSection() {
  return (
    <SettingSection
      title="Social Media"
      description="Manage your social media profile links."
    >
      <SocialCard />
    </SettingSection>
  );
}