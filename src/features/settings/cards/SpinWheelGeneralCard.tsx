import { Controller } from "react-hook-form";
import { FerrisWheel } from "lucide-react";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";

export default function SpinWheelGeneralCard() {
  const { form } = useSettingsContext();

  return (
    <SettingCard
      title="Spin Wheel"
      description="Configure the basic behavior of the Spin Wheel."
      icon={<FerrisWheel className="h-5 w-5" />}
    >
      <div className="space-y-6">
        {/* Enable Spin Wheel */}
        <Controller
          control={form.control}
          name="spinEnabled"
          render={({ field }) => (
            <label className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <h4 className="font-medium">
                  Enable Spin Wheel
                </h4>

                <p className="text-sm text-muted-foreground">
                  Allow customers to use the Spin Wheel.
                </p>
              </div>

              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) =>
                  field.onChange(e.target.checked)
                }
              />
            </label>
          )}
        />

        {/* Show Spin Card */}
        <Controller
          control={form.control}
          name="showSpinCard"
          render={({ field }) => (
            <label className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <h4 className="font-medium">
                  Show Spin Card
                </h4>

                <p className="text-sm text-muted-foreground">
                  Display the Spin Wheel card on the storefront.
                </p>
              </div>

              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) =>
                  field.onChange(e.target.checked)
                }
              />
            </label>
          )}
        />

        {/* Cooldown */}
        <Controller
          control={form.control}
          name="spinCooldownHours"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="font-medium">
                Cooldown Hours
              </label>

              <input
                type="number"
                min={1}
                max={168}
                className="w-full rounded-xl border px-4 py-2"
                {...field}
                onChange={(e) =>
                  field.onChange(Number(e.target.value))
                }
              />

              <p className="text-sm text-muted-foreground">
                Customers can spin again after this many
                hours.
              </p>
            </div>
          )}
        />

        {/* Maintenance Message */}
        <Controller
          control={form.control}
          name="spinMaintenanceMessage"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="font-medium">
                Maintenance Message
              </label>

              <textarea
                rows={4}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="The Spin Wheel is temporarily unavailable."
                {...field}
              />

              <p className="text-sm text-muted-foreground">
                This message is shown when the Spin Wheel is
                disabled.
              </p>
            </div>
          )}
        />
      </div>
    </SettingCard>
  );
}