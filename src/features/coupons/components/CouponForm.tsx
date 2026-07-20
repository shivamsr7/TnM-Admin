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
  onSubmit: (data: CouponFormData) => void | Promise<void>;
}

export default function CouponForm({
  initialData,
  loading = false,
  onSubmit,
}: CouponFormProps) {
  const isEditing = !!initialData;

  const form = useForm<CouponSchema>({
    resolver: zodResolver(couponSchema),

    defaultValues: {
      code: "",
      title: "",
      description: "",

      discount_type: "percentage",
      discount_value: 0,

      minimum_order_amount: 0,
      maximum_discount: null,

      usage_limit: null,

      one_use_per_customer: false,

      starts_at: null,
      expires_at: null,

      is_active: true,
    },
  });

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      code: initialData.code,
      title: initialData.title,
      description: initialData.description ?? "",

      discount_type: initialData.discount_type,
      discount_value: initialData.discount_value,

      minimum_order_amount:
        initialData.minimum_order_amount,

      maximum_discount:
        initialData.maximum_discount,

      usage_limit:
        initialData.usage_limit,

      one_use_per_customer:
        initialData.one_use_per_customer,

      starts_at: initialData.starts_at,

      expires_at: initialData.expires_at,

      is_active: initialData.is_active,
    });
  }, [initialData, form]);

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        onSubmit(values)
      )}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>Coupon Code</Label>

          <Input
            {...form.register("code")}
            placeholder="WELCOME10"
            className="uppercase"
          />
        </div>

        <div>
          <Label>Title</Label>

          <Input
            {...form.register("title")}
            placeholder="Welcome Offer"
          />
        </div>

      </div>

      <div>
        <Label>Description</Label>

        <Textarea
          rows={3}
          {...form.register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>Discount Type</Label>

          <select
            className="w-full rounded-md border px-3 py-2"
            {...form.register("discount_type")}
          >
            <option value="percentage">
              Percentage
            </option>

            <option value="fixed">
              Fixed Amount
            </option>
          </select>
        </div>

        <div>
          <Label>Discount Value</Label>

          <Input
            type="number"
            {...form.register("discount_value", {
              valueAsNumber: true,
            })}
          />
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <Label>Minimum Order</Label>

          <Input
            type="number"
            {...form.register(
              "minimum_order_amount",
              {
                valueAsNumber: true,
              }
            )}
          />
        </div>

        <div>
          <Label>Maximum Discount</Label>

          <Input
            type="number"
            {...form.register(
              "maximum_discount",
              {
                setValueAs: (v) =>
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
          <Label>Usage Limit</Label>

          <Input
            type="number"
            {...form.register("usage_limit", {
              setValueAs: (v) =>
                v === ""
                  ? null
                  : Number(v),
            })}
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
            onCheckedChange={(checked) =>
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
          <Label>Start Date</Label>

          <Input
            type="datetime-local"
            {...form.register("starts_at")}
          />
        </div>

        <div>
          <Label>Expiry Date</Label>

          <Input
            type="datetime-local"
            {...form.register("expires_at")}
          />
        </div>

      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">

        <Label>Active Coupon</Label>

        <Switch
          checked={form.watch("is_active")}
          onCheckedChange={(checked) =>
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
          onClick={() => form.reset()}
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