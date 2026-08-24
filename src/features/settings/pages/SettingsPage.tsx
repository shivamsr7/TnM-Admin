import {
  useState,
} from "react";

import SettingsSidebar from "../components/SettingsSidebar";
import SettingsContent from "../components/SettingsContent";
import SaveBar from "../components/SaveBar";
import SettingsProvider
from "../context/SettingsProvider";


export type SettingsSection =
  | "general"
  | "branding"
  | "contact"
  | "social"
  | "shipping"
  | "payment"
  | "seo"
  | "homepage"
  | "spinWheel"
  | "giftWrap"
  | "legal";


export default function SettingsPage() {

  const [
    activeSection,
    setActiveSection,
  ] = useState<SettingsSection>(
    "general"
  );


  return (

    <SettingsProvider>

      <div
        className="
          space-y-6
        "
      >

        <div
          className="
            grid
            gap-6
            lg:grid-cols-[260px_1fr]
          "
        >

          <SettingsSidebar
            active={
              activeSection
            }
            onChange={
              setActiveSection
            }
          />


          <SettingsContent
            active={
              activeSection
            }
          />

        </div>


        <SaveBar />

      </div>

    </SettingsProvider>

  );

}
