import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";

export default function PaymentMethodsCard() {
  const { form } = useSettingsContext();

  const razorpayEnabled = form.watch("razorpayEnabled");
  const partialCodEnabled = form.watch("partialCodEnabled");

  return (
    <SettingCard
      title="Payment Methods"
      description="Manage the payment methods available at checkout."
    >
      <div className="space-y-6">
        {/* Razorpay */}
        <div className="flex items-center justify-between rounded-xl border p-5">
          <div>
            <Label className="text-base font-semibold">
              Razorpay
            </Label>

            <p className="mt-1 text-sm text-muted-foreground">
              Accept UPI, Cards, Net Banking and Wallet payments.
            </p>
          </div>

          <Switch
            checked={razorpayEnabled}
            onCheckedChange={(checked) =>
              form.setValue("razorpayEnabled", checked, {
                shouldDirty: true,
              })
            }
          />
        </div>

        {/* Partial COD */}
        <div className="flex items-center justify-between rounded-xl border p-5 bg-slate-50">
          <div>
            <Label className="text-base font-semibold">
              Partial COD
            </Label>

            <p className="mt-1 text-sm text-muted-foreground">
              Managed from Shipping Settings.
            </p>
          </div>

          <Badge variant={partialCodEnabled ? "default" : "secondary"}>
            {partialCodEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </div>
    </SettingCard>
  );
}