import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSettingsContext } from "../context/SettingsContext";
import SettingCard from "../components/SettingCard";

export default function ContactCard() {
  const { form } = useSettingsContext();

  return (
    <SettingCard
      title="Contact Information"
      description="Manage your business contact details."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="supportEmail">Support Email</Label>
          <Input
            id="supportEmail"
            placeholder="support@example.com"
            {...form.register("supportEmail")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail">Business Email</Label>
          <Input
            id="businessEmail"
            placeholder="business@example.com"
            {...form.register("businessEmail")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="+91 9876543210"
            {...form.register("phone")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input
            id="whatsapp"
            placeholder="+91 9876543210"
            {...form.register("whatsapp")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Business Address</Label>
          <Input
            id="address"
            placeholder="Enter your business address"
            {...form.register("address")}
          />
        </div>
      </div>
    </SettingCard>
  );
}