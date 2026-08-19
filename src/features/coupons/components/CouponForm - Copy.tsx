import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  couponSchema,
  type CouponSchema,
} from "../schemas/coupon.schema";

import type {
  Coupon,
  CouponFormData,
} from "../types/coupon.types";

interface CouponFormProps {
  initialData?: Coupon | null;
  loading?: boolean;
  onSubmit: (
    data: CouponFormData
  ) => void | Promise<void>;
}

export default function CouponForm({
  initialData,
  loading = false,
  onSubmit,
}: CouponFormProps) {
  const isEditing = !!initialData;

  const form =
    useForm<CouponSchema>({
      resolver:
        zodResolver(couponSchema),

      defaultValues: {
        code: "",
        title: "",
        description: "",

        discount_type:
          "percentage",

        discount_value: 0,

        minimum_order_amount:
          0,

        maximum_discount:
          null,

        usage_limit:
          null,

        one_use_per_customer:
          false,

        starts_at:
          null,

        expires_at:
          null,

        is_active:
          true,

        spin_enabled:
          false,

        spin_probability:
          0,

        reward_display_name:
          "",

        show_in_cart:
          false,

        cart_display_text:
          "",

        cart_display_priority:
          0,
      },
    });

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      code:
        initialData.code,

      title:
        initialData.title,

      description:
        initialData.description ??
        "",

      discount_type:
        initialData.discount_type,

      discount_value:
        initialData.discount_value,

      minimum_order_amount:
        initialData.minimum_order_amount,

      maximum_discount:
        initialData.maximum_discount,

      usage_limit:
        initialData.usage_limit,

      one_use_per_customer:
        initialData.one_use_per_customer,

      starts_at:
        initialData.starts_at,

      expires_at:
        initialData.expires_at,

      is_active:
        initialData.is_active,

      spin_enabled:
        initialData.spin_enabled,

      spin_probability:
        initialData.spin_probability,

      reward_display_name:
        initialData.reward_display_name ??
        "",

      show_in_cart:
        initialData.show_in_cart,

      cart_display_text:
        initialData.cart_display_text ??
        "",

      cart_display_priority:
        initialData.cart_display_priority,
    });
  }, [
    initialData,
    form,
  ]);

  const spinEnabled =
    form.watch("spin_enabled");

  const discountType =
    form.watch("discount_type");

  const showInCart =
    form.watch("show_in_cart");

  const cartDisplayText =
    form.watch("cart_display_text");

  const couponCode =
    form.watch("code");

  useEffect(() => {
    if (
      discountType ===
        "free_shipping" ||
      discountType ===
        "free_gift"
    ) {
      form.setValue(
        "discount_value",
        0
      );
    }
  }, [
    discountType,
    form,
  ]);

  useEffect(() => {
    if (!spinEnabled) return;

    const current =
      form.getValues(
        "reward_display_name"
      );

    if (current?.trim()) return;

    const value =
      form.getValues(
        "discount_value"
      );

    switch (discountType) {
      case "percentage":
        form.setValue(
          "reward_display_name",
          `${value}% OFF`
        );
        break;

      case "fixed":
        form.setValue(
          "reward_display_name",
          `₹${value} OFF`
        );
        break;

      case "free_shipping":
        form.setValue(
          "reward_display_name",
          "Free Shipping"
        );
        break;

      case "free_gift":
        form.setValue(
          "reward_display_name",
          "Free Gift"
        );
        break;
    }
  }, [
    spinEnabled,
    discountType,
    form.watch("discount_value"),
    form,
  ]);

  return (
    <form
      onSubmit={form.handleSubmit(
        (values) =>
          onSubmit(values)
      )}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>
            Coupon Code
          </Label>

          <Input
            {...form.register("code")}
            placeholder="WELCOME10"
            className="uppercase"
          />
        </div>

        <div>
          <Label>
            Title
          </Label>

          <Input
            {...form.register("title")}
            placeholder="Welcome Offer"
          />
        </div>

      </div>

      <div>
        <Label>
          Description
        </Label>

        <Textarea
          rows={3}
          {...form.register(
            "description"
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>
            Discount Type
          </Label>

          <select
            className="w-full rounded-md border px-3 py-2"
            {...form.register(
              "discount_type"
            )}
          >
            <option value="percentage">
              Percentage
            </option>

            <option value="fixed">
              Fixed Amount
            </option>

            <option value="free_shipping">
              Free Shipping
            </option>

            <option value="free_gift">
              Free Gift
            </option>
          </select>
        </div>

        <div>
          <Label>
            Discount Value
          </Label>

          <Input
            type="number"
            disabled={
              discountType ===
                "free_shipping" ||
              discountType ===
                "free_gift"
            }
            {...form.register(
              "discount_value",
              {
                valueAsNumber:
                  true,
              }
            )}
          />
        </div>

      </div>

      {/* Cart Banner Settings */}
      <div className="rounded-xl border bg-muted/30 p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            🛒 Cart Banner Settings
          </h3>

          <p className="text-sm text-muted-foreground">
            Control whether this coupon is promoted in the cart drawer.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-background p-4">

          <div>
            <Label>
              Show in Cart
            </Label>

            <p className="text-sm text-muted-foreground">
              Show this coupon as the promotional banner in the cart.
            </p>
          </div>

          <Switch
            checked={showInCart}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "show_in_cart",
                checked,
                {
                  shouldDirty:
                    true,
                }
              )
            }
          />

        </div>

        {showInCart && (
          <>
            <div>
              <Label>
                Cart Display Text
              </Label>

              <Input
                placeholder="Buy 4 at ₹2999"
                {...form.register(
                  "cart_display_text"
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                This is the main promotional text shown in the cart.
              </p>
            </div>

            <div>
              <Label>
                Display Priority
              </Label>

              <Input
                type="number"
                min={0}
                {...form.register(
                  "cart_display_priority",
                  {
                    valueAsNumber:
                      true,
                  }
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                If multiple coupons are enabled for the cart, the highest priority is shown.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Cart Preview
              </p>

              <p className="mt-2 text-sm font-semibold">
                ✨{" "}
                {cartDisplayText?.trim() ||
                  "Your promotional offer"}{" "}
                | Use Code :{" "}
                {couponCode?.trim().toUpperCase() ||
                  "COUPONCODE"}
              </p>
            </div>
          </>
        )}

      </div>

      {/* Spin Wheel Settings */}
      <div className="rounded-xl border bg-muted/30 p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            🎡 Spin Wheel Settings
          </h3>

          <p className="text-sm text-muted-foreground">
            Configure this coupon for the Spin Wheel.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-background p-4">

          <div>
            <Label>
              Enable for Spin Wheel
            </Label>

            <p className="text-sm text-muted-foreground">
              Allow this coupon to appear as a Spin Wheel reward.
            </p>
          </div>

          <Switch
            checked={spinEnabled}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "spin_enabled",
                checked
              )
            }
          />

        </div>

        {spinEnabled && (
          <>
            <div>
              <Label>
                Reward Display Name
              </Label>

              <Input
                placeholder="20% OFF"
                {...form.register(
                  "reward_display_name"
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                This text will be shown on the Spin Wheel.
              </p>
            </div>

            <div>
              <Label>
                Probability Weight
              </Label>

              <Input
                type="number"
                min={1}
                {...form.register(
                  "spin_probability",
                  {
                    valueAsNumber:
                      true,
                  }
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                Higher numbers increase the chance of winning this reward.
              </p>
            </div>
          </>
        )}

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>
            Minimum Order
          </Label>

          <Input
            type="number"
            {...form.register(
              "minimum_order_amount",
              {
                valueAsNumber:
                  true,
              }
            )}
          />
        </div>

        <div>
          <Label>
            Maximum Discount
          </Label>

          <Input
            type="number"
            {...form.register(
              "maximum_discount",
              {
                setValueAs:
                  (v) =>
                    v === ""
                      ? null
                      : Number(v),
              }
            )}
          />
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>
            Usage Limit
          </Label>

          <Input
            type="number"
            {...form.register(
              "usage_limit",
              {
                setValueAs:
                  (v) =>
                    v === ""
                      ? null
                      : Number(v),
              }
            )}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 mt-6">

          <Label>
            One Use Per Customer
          </Label>

          <Switch
            checked={form.watch(
              "one_use_per_customer"
            )}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "one_use_per_customer",
                checked
              )
            }
          />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>
            Start Date
          </Label>

          <Input
            type="datetime-local"
            {...form.register(
              "starts_at"
            )}
          />
        </div>

        <div>
          <Label>
            Expiry Date
          </Label>

          <Input
            type="datetime-local"
            {...form.register(
              "expires_at"
            )}
          />
        </div>

      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">

        <Label>
          Active Coupon
        </Label>

        <Switch
          checked={form.watch(
            "is_active"
          )}
          onCheckedChange={(
            checked
          ) =>
            form.setValue(
              "is_active",
              checked
            )
          }
        />

      </div>

      <div className="flex justify-end gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            form.reset()
          }
        >
          Reset
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {isEditing
            ? "Update Coupon"
            : "Create Coupon"}
        </Button>

      </div>

    </form>
  );
}
