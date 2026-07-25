import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";

export default function SocialCard() {
  const { form } = useSettingsContext();

  return (
    <SettingCard
      title="Social Media"
      description="Add links to your social media profiles."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            placeholder="https://instagram.com/yourstore"
            {...form.register("instagram")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            placeholder="https://facebook.com/yourstore"
            {...form.register("facebook")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube">YouTube</Label>
          <Input
            id="youtube"
            placeholder="https://youtube.com/@yourstore"
            {...form.register("youtube")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pinterest">Pinterest</Label>
          <Input
            id="pinterest"
            placeholder="https://pinterest.com/yourstore"
            {...form.register("pinterest")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">X (Twitter)</Label>
          <Input
            id="twitter"
            placeholder="https://x.com/yourstore"
            {...form.register("twitter")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/company/yourstore"
            {...form.register("linkedin")}
          />
        </div>
      </div>
    </SettingCard>
  );
}