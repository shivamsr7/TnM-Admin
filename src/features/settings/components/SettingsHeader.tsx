import { Settings2 } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
          <Settings2 size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Store Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Configure your store information, branding, shipping,
            payment, SEO and other business preferences.
          </p>
        </div>
      </div>
    </div>
  );
}