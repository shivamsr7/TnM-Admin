import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ShippingCard() {
  const { form } = useSettingsContext();

  const partialCodEnabled = form.watch("partialCodEnabled");

  return (
    <SettingCard
      title="Shipping & Delivery"
      description="Configure shipping charges, delivery details and Partial COD."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Free Shipping */}
        <div className="space-y-2">
          <Label htmlFor="freeShippingThreshold">
            Free Shipping Above (₹)
          </Label>

          <Input
            id="freeShippingThreshold"
            type="number"
            placeholder="999"
            {...form.register("freeShippingThreshold", {
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Shipping Charge */}
        <div className="space-y-2">
          <Label htmlFor="shippingCharge">
            Shipping Charge (₹)
          </Label>

          <Input
            id="shippingCharge"
            type="number"
            placeholder="49"
            {...form.register("shippingCharge", {
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Delivery Time */}
        <div className="space-y-2 md:col-span-2">
  <Label htmlFor="deliveryTime">
    Estimated Delivery Time
  </Label>

  <Select
    value={form.watch("deliveryTime")}
    onValueChange={(value) =>
      form.setValue("deliveryTime", value, {
        shouldDirty: true,
      })
    }
  >
    <SelectTrigger id="deliveryTime">
      <SelectValue placeholder="Select delivery time" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="2–4 Business Days">
        2–4 Business Days
      </SelectItem>

      <SelectItem value="3–5 Business Days">
        3–5 Business Days
      </SelectItem>

      <SelectItem value="3–7 Business Days">
        3–7 Business Days
      </SelectItem>

      <SelectItem value="5–7 Business Days">
        5–7 Business Days
      </SelectItem>

      <SelectItem value="7–10 Business Days">
        7–10 Business Days
      </SelectItem>

      <SelectItem value="10–15 Business Days">
        10–15 Business Days
      </SelectItem>

      <SelectItem value="Custom">
        Custom
      </SelectItem>
    </SelectContent>
  </Select>

  <p className="text-xs text-slate-500">
    This information will be displayed on product pages and checkout.
  </p>
</div>

        {/* Shipping Note */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shippingNote">
            Shipping Note
          </Label>

          <Textarea
            id="shippingNote"
            rows={4}
            placeholder="Orders are dispatched within 24–48 hours. Delivery usually takes 3–7 business days."
            {...form.register("shippingNote")}
          />
        </div>

        {/* Partial COD */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                Partial COD
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Collect an advance payment online and the remaining amount on delivery.
              </p>
            </div>

            <Switch
              checked={partialCodEnabled}
              onCheckedChange={(checked) =>
                form.setValue("partialCodEnabled", checked, {
                  shouldDirty: true,
                })
              }
            />
          </div>

          {partialCodEnabled && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Advance Amount */}
              <div className="space-y-2">
                <Label htmlFor="partialCodAmount">
                  Advance Payment (₹)
                </Label>

                <Input
                  id="partialCodAmount"
                  type="number"
                  placeholder="199"
                  {...form.register("partialCodAmount", {
                    valueAsNumber: true,
                  })}
                />

                <p className="text-xs text-slate-500">
                  Customers must pay this amount online before the order is confirmed.
                </p>
              </div>

              {/* Minimum Order */}
              <div className="space-y-2">
                <Label htmlFor="partialCodMinOrder">
                  Minimum Order Value (₹)
                </Label>

                <Input
                  id="partialCodMinOrder"
                  type="number"
                  placeholder="999"
                  {...form.register("partialCodMinOrder", {
                    valueAsNumber: true,
                  })}
                />

                <p className="text-xs text-slate-500">
                  Partial COD will only be available for orders above this amount.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SettingCard>
  );
}