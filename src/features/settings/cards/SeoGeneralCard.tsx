import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";

export default function SeoGeneralCard() {
  const { form } = useSettingsContext();

  return (
    <SettingCard
      title="General SEO"
      description="Default SEO settings used across your store."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>SEO Title</Label>

          <Input
            placeholder="TnM Jewels | Premium Anti Tarnish Jewellery"
            {...form.register("seoTitle")}
          />
        </div>

        <div className="space-y-2">
          <Label>Meta Description</Label>

          <Textarea
            rows={4}
            placeholder="Write a compelling description for search engines."
            {...form.register("seoDescription")}
          />
        </div>

        <div className="space-y-2">
          <Label>Keywords</Label>

          <Input
            placeholder="Jewellery, Rings, Earrings..."
            {...form.register("seoKeywords")}
          />
        </div>

        <div className="space-y-2">
          <Label>Canonical URL</Label>

          <Input
            placeholder="https://tnmjewels.com"
            {...form.register("canonicalUrl")}
          />
        </div>
      </div>
    </SettingCard>
  );
}