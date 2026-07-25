import {
  Globe,
  Palette,
  Phone,
  Share2,
  Truck,
  CreditCard,
  Search,
  Monitor,
  FileText,
  FerrisWheel,
} from "lucide-react";

import type { SettingsSection } from "../pages/SettingsPage";

interface SettingsSidebarProps {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
}

const sections: {
  id: SettingsSection;
  title: string;
  icon: React.ElementType;
}[] = [
  {
    id: "general",
    title: "General",
    icon: Globe,
  },
  {
    id: "branding",
    title: "Branding",
    icon: Palette,
  },
  {
    id: "contact",
    title: "Contact",
    icon: Phone,
  },
  {
    id: "social",
    title: "Social Media",
    icon: Share2,
  },
  {
    id: "shipping",
    title: "Shipping",
    icon: Truck,
  },
  {
    id: "payment",
    title: "Payments",
    icon: CreditCard,
  },
  {
  id: "spinWheel",
  title: "Spin Wheel",
  icon: FerrisWheel,
},
  {
    id: "seo",
    title: "SEO",
    icon: Search,
  },
  {
    id: "homepage",
    title: "Homepage",
    icon: Monitor,
  },
  {
    id: "legal",
    title: "Legal",
    icon: FileText,
  },
];

export default function SettingsSidebar({
  active,
  onChange,
}: SettingsSidebarProps) {
  return (
    <aside className="sticky top-6 h-fit rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 px-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Settings
      </h2>

      <div className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;

          const isActive = active === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />

              <span className="text-sm font-medium">
                {section.title}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}