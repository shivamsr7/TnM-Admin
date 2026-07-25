import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SettingCard from "../components/SettingCard";
import SingleImageUploader from "@/shared/components/upload/SingleImageUploader";
import { useSettingsContext } from "../context/SettingsContext";

export default function SocialPreviewCard() {
  const { form } = useSettingsContext();

  return (
    <SettingCard
      title="Social Sharing"
      description="Configure the default preview shown when your website is shared."
    >
      <div className="space-y-6">
        {/* Open Graph Image */}
        <div className="space-y-2">
          <Label>Default Open Graph Image</Label>

          <SingleImageUploader
            value={form.watch("defaultOgImage")}
            folder="seo"
            title="Open Graph Image"
            onChange={(url) =>
              form.setValue("defaultOgImage", url ?? "", {
                shouldDirty: true,
              })
            }
          />

          <p className="text-xs text-muted-foreground">
            Recommended size: <strong>1200 × 630 px</strong>.
          </p>

          <p className="text-xs text-muted-foreground">
            This image is used when your website is shared on WhatsApp,
            Facebook, LinkedIn, X and other social platforms.
          </p>
        </div>

        {/* Twitter Card */}
        <div className="space-y-2">
          <Label>Twitter Card Type</Label>

          <Select
            value={form.watch("twitterCard")}
            onValueChange={(value) =>
              form.setValue(
                "twitterCard",
                value as "summary" | "summary_large_image",
                {
                  shouldDirty: true,
                }
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="summary">
                Summary
              </SelectItem>

              <SelectItem value="summary_large_image">
                Summary Large Image
              </SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            We recommend <strong>Summary Large Image</strong> for better
            engagement on social media.
          </p>
        </div>

        {/* Preview Info */}
        <div className="rounded-xl border bg-muted/40 p-4">
          <h4 className="font-medium">Social Preview</h4>

          <p className="mt-2 text-sm text-muted-foreground">
            If a page doesn't provide its own Open Graph metadata, these default
            settings will be used automatically.
          </p>
        </div>
      </div>
    </SettingCard>
  );
}