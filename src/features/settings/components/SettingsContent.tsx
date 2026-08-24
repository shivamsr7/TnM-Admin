import type {
  SettingsSection,
} from "../pages/SettingsPage";

import GeneralSection from "../sections/GeneralSection";
import BrandingSection from "../sections/BrandingSection";
import ContactSection from "../sections/ContactSection";
import SocialSection from "../sections/SocialSection";
import ShippingSection from "../sections/ShippingSection";
import PaymentSection from "../sections/PaymentSection";
import SeoSection from "../sections/SeoSection";
import HomepageSection from "../sections/HomepageSection";
import LegalSection from "../sections/LegalSection";
import SpinWheelSection from "../sections/SpinWheelSection";
import GiftWrapSection from "../sections/GiftWrapSection";


interface SettingsContentProps {
  active: SettingsSection;
}


export default function SettingsContent({
  active,
}: SettingsContentProps) {

  switch (
    active
  ) {

    case "general":
      return <GeneralSection />;

    case "branding":
      return <BrandingSection />;

    case "contact":
      return <ContactSection />;

    case "social":
      return <SocialSection />;

    case "shipping":
      return <ShippingSection />;

    case "payment":
      return <PaymentSection />;

    case "seo":
      return <SeoSection />;

    case "homepage":
      return <HomepageSection />;

    case "spinWheel":
      return <SpinWheelSection />;

    case "giftWrap":
      return <GiftWrapSection />;

    case "legal":
      return <LegalSection />;

    default:
      return <GeneralSection />;

  }

}
