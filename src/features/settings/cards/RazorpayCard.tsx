import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";

export default function RazorpayCard() {
  const { form } = useSettingsContext();

  const enabled = form.watch("razorpayEnabled");

  return (
    <SettingCard
      title="Razorpay Configuration"
      description="Configure your Razorpay payment gateway."
    >
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4">
          <div>
            <h4 className="font-medium text-slate-900">
              Gateway Status
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Current payment gateway availability.
            </p>
          </div>

          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Active" : "Disabled"}
          </Badge>
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <Label>Mode</Label>

          <Select
            value={form.watch("razorpayMode")}
            onValueChange={(value) =>
              form.setValue(
                "razorpayMode",
                value as "test" | "live",
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
              <SelectItem value="test">
                Test Mode
              </SelectItem>

              <SelectItem value="live">
                Live Mode
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key ID */}
        <div className="space-y-2">
          <Label htmlFor="razorpayKeyId">
            Razorpay Key ID
          </Label>

          <Input
            id="razorpayKeyId"
            placeholder="rzp_test_xxxxxxxxxxxxxx"
            {...form.register("razorpayKeyId")}
          />

          <p className="text-xs text-slate-500">
            Enter your Razorpay Key ID. The secret key should remain on your backend and is never stored here.
          </p>
        </div>
      </div>
    </SettingCard>
  );
}