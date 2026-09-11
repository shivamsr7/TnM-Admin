import { useEffect, useState } from "react";
import { Cake, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  birthdayCouponService,
} from "../services/birthdayCoupon.service";

import type {
  BirthdayCouponSettingsFormData,
} from "../types/birthdayCoupon.types";


const defaultSettings: BirthdayCouponSettingsFormData = {
  is_enabled: false,

  coupon_prefix: "BDAY-TNM",

  title: "Birthday Month Reward",

  description:
    "Celebrate your birthday month with a special reward from T&M Jewels.",

  discount_type: "fixed",

  discount_value: 300,

  minimum_order_amount: 1499,

  maximum_discount: null,

  one_use_per_customer: true,

  stacking_mode: "exclusive",

  auto_apply: false,
};


export default function BirthdayCouponSettings() {

  const [
    settings,
    setSettings,
  ] = useState<BirthdayCouponSettingsFormData>(
    defaultSettings
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);


  useEffect(() => {

    let cancelled = false;

    async function loadSettings() {

      try {

        setLoading(true);

        const data =
          await birthdayCouponService.getSettings();

        if (
          cancelled
        ) {
          return;
        }

        if (data) {

          setSettings({
            is_enabled:
              data.is_enabled,

            coupon_prefix:
              data.coupon_prefix,

            title:
              data.title,

            description:
              data.description ?? "",

            discount_type:
              data.discount_type,

            discount_value:
              data.discount_value,

            minimum_order_amount:
              data.minimum_order_amount,

            maximum_discount:
              data.maximum_discount,

            one_use_per_customer:
              data.one_use_per_customer,

            stacking_mode:
              data.stacking_mode,

            auto_apply:
              data.auto_apply,
          });

        }

      } catch (error) {

        console.error(
          "Failed to load birthday coupon settings:",
          error
        );

        toast.error(
          "Failed to load birthday reward settings."
        );

      } finally {

        if (
          !cancelled
        ) {
          setLoading(false);
        }

      }

    }

    loadSettings();

    return () => {
      cancelled = true;
    };

  }, []);


  const updateField = <
    K extends keyof BirthdayCouponSettingsFormData
  >(
    field: K,
    value: BirthdayCouponSettingsFormData[K]
  ) => {

    setSettings(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

  };


  const handleSave = async () => {

    if (
      !settings.coupon_prefix.trim()
    ) {
      toast.error(
        "Coupon prefix is required."
      );

      return;
    }


    if (
      !settings.title.trim()
    ) {
      toast.error(
        "Birthday reward title is required."
      );

      return;
    }


    if (
      settings.discount_value < 0
    ) {
      toast.error(
        "Discount value cannot be negative."
      );

      return;
    }


    if (
      settings.minimum_order_amount < 0
    ) {
      toast.error(
        "Minimum order amount cannot be negative."
      );

      return;
    }


    if (
      settings.maximum_discount !== null &&
      settings.maximum_discount < 0
    ) {
      toast.error(
        "Maximum discount cannot be negative."
      );

      return;
    }


    if (
      settings.discount_type ===
        "percentage" &&
      settings.discount_value > 100
    ) {
      toast.error(
        "Percentage discount cannot exceed 100%."
      );

      return;
    }


    try {

      setSaving(true);

      const saved =
        await birthdayCouponService.updateSettings(
          {
            ...settings,

            coupon_prefix:
              settings.coupon_prefix
                .trim()
                .toUpperCase(),

            title:
              settings.title.trim(),

            description:
              settings.description?.trim() ||
              null,
          }
        );


      setSettings({
        is_enabled:
          saved.is_enabled,

        coupon_prefix:
          saved.coupon_prefix,

        title:
          saved.title,

        description:
          saved.description ?? "",

        discount_type:
          saved.discount_type,

        discount_value:
          saved.discount_value,

        minimum_order_amount:
          saved.minimum_order_amount,

        maximum_discount:
          saved.maximum_discount,

        one_use_per_customer:
          saved.one_use_per_customer,

        stacking_mode:
          saved.stacking_mode,

        auto_apply:
          saved.auto_apply,
      });


      toast.success(
        "Birthday reward settings saved."
      );

    } catch (error) {

      console.error(
        "Failed to save birthday coupon settings:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save birthday reward settings."
      );

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (
      <div className="flex items-center justify-center rounded-xl border bg-muted/20 p-10">

        <Loader2 className="mr-2 h-5 w-5 animate-spin" />

        <span className="text-sm text-muted-foreground">
          Loading birthday reward settings...
        </span>

      </div>
    );

  }


  return (

    <div className="rounded-xl border bg-muted/20">

      {/* HEADER */}

      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">

            <Cake className="h-5 w-5 text-primary" />

          </div>

          <div>

            <h2 className="text-lg font-semibold">
              Birthday Rewards
            </h2>

            <p className="text-sm text-muted-foreground">
              Automatically reward customers during their birthday month.
            </p>

          </div>

        </div>


        <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">

          <div>

            <p className="text-sm font-medium">
              Birthday Rewards
            </p>

            <p className="text-xs text-muted-foreground">
              {settings.is_enabled
                ? "Currently active"
                : "Currently disabled"}
            </p>

          </div>

          <Switch
            checked={
              settings.is_enabled
            }
            onCheckedChange={(
              checked
            ) =>
              updateField(
                "is_enabled",
                checked
              )
            }
          />

        </div>

      </div>


      {/* CONTENT */}

      <div className="space-y-6 p-5">

        {/* BASIC */}

        <div className="space-y-4">

          <div>

            <h3 className="font-semibold">
              Birthday Coupon
            </h3>

            <p className="text-sm text-muted-foreground">
              Configure the coupon that will be generated for eligible customers.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">

              <Label>
                Coupon Prefix
              </Label>

              <Input
                value={
                  settings.coupon_prefix
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "coupon_prefix",
                    event.target.value
                  )
                }
                placeholder="BDAY-TNM"
              />

              <p className="text-xs text-muted-foreground">
                Example: BDAY-TNM-7X4K
              </p>

            </div>


            <div className="space-y-2">

              <Label>
                Reward Title
              </Label>

              <Input
                value={
                  settings.title
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Birthday Month Reward"
              />

            </div>

          </div>


          <div className="space-y-2">

            <Label>
              Description
            </Label>

            <Textarea
              rows={3}
              value={
                settings.description ?? ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              placeholder="Celebrate your birthday month..."
            />

          </div>

        </div>


        {/* DISCOUNT */}

        <div className="space-y-4 rounded-lg border bg-background p-4">

          <div>

            <h3 className="font-semibold">
              Discount
            </h3>

            <p className="text-sm text-muted-foreground">
              These values can be changed anytime from Admin.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">

              <Label>
                Discount Type
              </Label>

              <select
                value={
                  settings.discount_type
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "discount_type",
                    event.target
                      .value as
                      | "fixed"
                      | "percentage"
                  )
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >

                <option value="fixed">
                  Fixed Amount
                </option>

                <option value="percentage">
                  Percentage
                </option>

              </select>

            </div>


            <div className="space-y-2">

              <Label>
                Discount Value
              </Label>

              <Input
                type="number"
                min={0}
                max={
                  settings.discount_type ===
                  "percentage"
                    ? 100
                    : undefined
                }
                value={
                  settings.discount_value
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "discount_value",
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">

              <Label>
                Minimum Order Amount
              </Label>

              <Input
                type="number"
                min={0}
                value={
                  settings.minimum_order_amount
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "minimum_order_amount",
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>


            <div className="space-y-2">

              <Label>
                Maximum Discount
              </Label>

              <Input
                type="number"
                min={0}
                placeholder="No limit"
                value={
                  settings.maximum_discount ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "maximum_discount",
                    event.target.value ===
                      ""
                      ? null
                      : Number(
                          event.target.value
                        )
                  )
                }
              />

            </div>

          </div>

        </div>


        {/* RULES */}

        <div className="space-y-4 rounded-lg border bg-background p-4">

          <div>

            <h3 className="font-semibold">
              Usage & Rules
            </h3>

          </div>


          <div className="flex items-center justify-between rounded-lg border p-4">

            <div>

              <Label>
                One Use Per Customer
              </Label>

              <p className="text-sm text-muted-foreground">
                Each customer can use their birthday reward once.
              </p>

            </div>

            <Switch
              checked={
                settings.one_use_per_customer
              }
              onCheckedChange={(
                checked
              ) =>
                updateField(
                  "one_use_per_customer",
                  checked
                )
              }
            />

          </div>


          <div className="space-y-2">

            <Label>
              Coupon Combination
            </Label>

            <select
              value={
                settings.stacking_mode
              }
              onChange={(
                event
              ) =>
                updateField(
                  "stacking_mode",
                  event.target
                    .value as
                    | "exclusive"
                    | "stackable"
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >

              <option value="exclusive">
                Cannot Combine
              </option>

              <option value="stackable">
                Can Combine
              </option>

            </select>

          </div>


          <div className="flex items-center justify-between rounded-lg border p-4">

            <div>

              <Label>
                Auto Apply
              </Label>

              <p className="text-sm text-muted-foreground">
                Automatically apply the birthday coupon when eligible.
              </p>

            </div>

            <Switch
              checked={
                settings.auto_apply
              }
              onCheckedChange={(
                checked
              ) =>
                updateField(
                  "auto_apply",
                  checked
                )
              }
            />

          </div>

        </div>


        {/* VALIDITY */}

        <div className="rounded-lg border bg-background p-4">

          <div className="flex items-start gap-3">

            <Cake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>

              <p className="font-medium">
                Birthday Month Validity
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Each customer's birthday reward will automatically
                be valid from the first day through the last day of
                their birthday month.
              </p>

            </div>

          </div>

        </div>


        {/* SAVE */}

        <div className="flex justify-end border-t pt-5">

          <Button
            type="button"
            onClick={
              handleSave
            }
            disabled={saving}
          >

            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Birthday Settings
              </>
            )}

          </Button>

        </div>

      </div>

    </div>

  );

}