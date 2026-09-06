import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SectionCard from "@/shared/components/admin/SectionCard";

import type { ProductSchema } from "../../schemas/product.schema";

interface Props {
  form: UseFormReturn<ProductSchema>;
}

export default function PricingSection({ form }: Props) {
  const { register, watch } = form;

  const costPrice = Number(watch("cost_price")) || 0;
  const sellingPrice = Number(watch("price")) || 0;
  const comparePrice = Number(watch("compare_price")) || 0;

  const specialDiscountEnabled =
    Boolean(
      watch("special_discount_enabled")
    );

  const specialDiscountType =
    watch("special_discount_type");

  const specialDiscountValue =
    Number(
      watch("special_discount_value")
    ) || 0;

  const specialDiscountEndsAt =
    watch("special_discount_ends_at");

  const profit = useMemo(() => {
    return sellingPrice - costPrice;
  }, [sellingPrice, costPrice]);

  const margin = useMemo(() => {
    if (!costPrice) return 0;

    return Number(
      ((profit / costPrice) * 100).toFixed(1)
    );
  }, [profit, costPrice]);

  const discount = useMemo(() => {
    if (
      !comparePrice ||
      comparePrice <= sellingPrice
    ) {
      return 0;
    }

    return Number(
      (
        ((comparePrice - sellingPrice) /
          comparePrice) *
        100
      ).toFixed(0)
    );
  }, [comparePrice, sellingPrice]);

  const specialDiscountAmount =
    useMemo(() => {
      if (
        !specialDiscountEnabled ||
        !specialDiscountValue ||
        !sellingPrice
      ) {
        return 0;
      }

      if (
        specialDiscountType ===
        "percentage"
      ) {
        return Number(
          (
            sellingPrice *
            (specialDiscountValue / 100)
          ).toFixed(2)
        );
      }

      return Number(
        Math.min(
          specialDiscountValue,
          sellingPrice
        ).toFixed(2)
      );
    }, [
      specialDiscountEnabled,
      specialDiscountValue,
      specialDiscountType,
      sellingPrice,
    ]);

  const specialCustomerPrice =
    useMemo(() => {
      if (!specialDiscountEnabled) {
        return sellingPrice;
      }

      return Number(
        Math.max(
          0,
          sellingPrice -
            specialDiscountAmount
        ).toFixed(2)
      );
    }, [
      sellingPrice,
      specialDiscountEnabled,
      specialDiscountAmount,
    ]);

  return (
    <SectionCard
      title="Pricing"
      description="Configure pricing, profit margin and discounts."
    >
      <div className="space-y-6">

        <div className="grid gap-5 lg:grid-cols-3">

          <div className="space-y-2">
            <Label htmlFor="cost_price">
              Cost Price (₹)
            </Label>

            <Input
              id="cost_price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("cost_price", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Selling Price (₹)
            </Label>

            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="compare_price">
              Compare At Price (₹)
            </Label>

            <Input
              id="compare_price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("compare_price", {
                valueAsNumber: true,
              })}
            />
          </div>

        </div>


        <div
          className="
            rounded-lg
            border
            bg-muted/20
            p-5
          "
        >

          <div className="mb-5">

            <h3 className="text-base font-semibold">
              Special Product Discount
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Apply an additional discount to the current selling price.
            </p>

          </div>


          <label
            className="
              flex
              cursor-pointer
              items-center
              gap-3
            "
          >

            <input
              type="checkbox"
              className="
                h-4
                w-4
                rounded
                border
              "
              {...register(
                "special_discount_enabled"
              )}
            />

            <span className="text-sm font-medium">
              Enable Special Discount
            </span>

          </label>


          {
            specialDiscountEnabled && (

              <div className="mt-5 grid gap-5 lg:grid-cols-2">

                <div className="space-y-2">

                  <Label htmlFor="special_discount_type">
                    Discount Type
                  </Label>

                  <select
                    id="special_discount_type"
                    className="
                      flex
                      h-10
                      w-full
                      rounded-md
                      border
                      bg-background
                      px-3
                      py-2
                      text-sm
                    "
                    {...register(
                      "special_discount_type"
                    )}
                  >

                    <option value="percentage">
                      Percentage (%)
                    </option>

                    <option value="fixed">
                      Fixed Amount (₹)
                    </option>

                  </select>

                </div>


                <div className="space-y-2">

                  <Label htmlFor="special_discount_value">
                    Discount Value
                  </Label>

                  <Input
                    id="special_discount_value"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    {...register(
                      "special_discount_value",
                      {
                        valueAsNumber: true,
                      }
                    )}
                  />

                </div>

                <div className="space-y-2">

                  <Label htmlFor="special_discount_ends_at">
                    Special Offer Ends
                  </Label>

                  <Input
                    id="special_discount_ends_at"
                    type="datetime-local"
                    {...register(
                      "special_discount_ends_at"
                    )}
                  />

                  <p className="text-xs text-muted-foreground">
                    The countdown will use this exact date and time.
                  </p>

                </div>

              </div>

            )
          }


          {
            specialDiscountEnabled &&
            sellingPrice > 0 &&
            specialDiscountValue > 0 && (

              <div
                className="
                  mt-5
                  rounded-lg
                  border
                  bg-background
                  p-4
                "
              >

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Special Customer Price
                    </p>

                    <p className="mt-1 whitespace-nowrap text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                      ₹{specialCustomerPrice.toFixed(2)}
                    </p>
                  </div>


                  <div className="text-right">

                    <p className="text-sm text-muted-foreground">
                      You Save
                    </p>

                    <p className="mt-1 whitespace-nowrap text-base font-semibold leading-tight tracking-tight sm:text-lg">
                      ₹{specialDiscountAmount.toFixed(2)}
                    </p>

                  </div>

                </div>

                {specialDiscountEndsAt && (
                  <div
                    className="
                      mt-4
                      border-t
                      pt-3
                      text-sm
                    "
                  >
                    <span className="text-muted-foreground">
                      Offer ends:
                    </span>{" "}
                    <span className="font-medium">
                      {new Date(
                        specialDiscountEndsAt
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

              </div>

            )
          }

        </div>


        <div className="grid grid-cols-3 gap-2 sm:gap-4">

          <div className="min-w-0 rounded-lg border bg-muted/30 p-3 text-center sm:p-4">
            <p className="text-sm text-muted-foreground">
              Profit
            </p>

            <p className="mt-1 whitespace-nowrap text-lg font-bold leading-tight tracking-tight sm:text-xl">
              ₹{profit.toFixed(2)}
            </p>
          </div>

          <div className="min-w-0 rounded-lg border bg-muted/30 p-3 text-center sm:p-4">
            <p className="text-sm text-muted-foreground">
              Profit Margin
            </p>

            <p className="mt-1 whitespace-nowrap text-lg font-bold leading-tight tracking-tight sm:text-xl">
              {margin}%
            </p>
          </div>

          <div className="min-w-0 rounded-lg border bg-muted/30 p-3 text-center sm:p-4">
            <p className="text-sm text-muted-foreground">
              Customer Discount
            </p>

            <p className="mt-1 whitespace-nowrap text-lg font-bold leading-tight tracking-tight sm:text-xl">
              {discount}%
            </p>
          </div>

        </div>

      </div>
    </SectionCard>
  );
}
