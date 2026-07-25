import SettingSection from "../components/SettingSection";

import SeoGeneralCard from "../cards/SeoGeneralCard";
import SearchEngineCard from "../cards/SearchEngineCard";
import SocialPreviewCard from "../cards/SocialPreviewCard";

export default function SeoSection() {
  return (
    <SettingSection
      title="SEO"
      description="Manage search engine optimization and social sharing settings."
    >
      <div className="space-y-8">
        <SeoGeneralCard />
        <SearchEngineCard />
        <SocialPreviewCard />
      </div>
    </SettingSection>
  );
}