import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";

const ROBOTS_OPTIONS = [
  {
    value: "index,follow",
    label: "Index & Follow (Recommended)",
  },
  {
    value: "index,nofollow",
    label: "Index & No Follow",
  },
  {
    value: "noindex,follow",
    label: "No Index & Follow",
  },
  {
    value: "noindex,nofollow",
    label: "No Index & No Follow",
  },
];

export default function SearchEngineCard() {
  const { form } = useSettingsContext();

  return (
    <SettingCard
      title="Search Engine Settings"
      description="Control how search engines crawl and verify your website."
    >
      <div className="space-y-6">
        {/* Robots */}
        <div className="space-y-2">
          <Label>Robots</Label>

          <Select
            value={form.watch("robots")}
            onValueChange={(value) =>
              form.setValue("robots", value, {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {ROBOTS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            Choose how search engines should index your store.
          </p>
        </div>

        {/* Google */}
        <div className="space-y-2">
          <Label>Google Site Verification</Label>

          <Input
            placeholder="google-site-verification=..."
            {...form.register("googleSiteVerification")}
          />

          <p className="text-xs text-muted-foreground">
            Verification token from Google Search Console.
          </p>
        </div>

        {/* Bing */}
        <div className="space-y-2">
          <Label>Bing Site Verification</Label>

          <Input
            placeholder="msvalidate.01=..."
            {...form.register("bingSiteVerification")}
          />

          <p className="text-xs text-muted-foreground">
            Verification token from Bing Webmaster Tools.
          </p>
        </div>
      </div>
    </SettingCard>
  );
}