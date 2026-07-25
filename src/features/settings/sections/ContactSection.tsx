import SettingSection from "../components/SettingSection";
import ContactCard from "../cards/ContactCard";

export default function ContactSection() {
  return (
    <SettingSection
      title="Contact"
      description="Manage your business contact information."
    >
      <ContactCard />
    </SettingSection>
  );
}