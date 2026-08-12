import type {
  UseFormReturn,
} from "react-hook-form";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import SectionCard
  from "@/shared/components/admin/SectionCard";

import type {
  ProductSchema,
} from "../../schemas/product.schema";


interface DimensionsSectionProps {

  form:
    UseFormReturn<ProductSchema>;

}


export default function DimensionsSection({

  form,

}: DimensionsSectionProps) {


  return (

    <SectionCard

      title="Weight & Dimensions"

      description="
        Enter the product weight and dimensions.
        These values can also be used for shipping
        calculations.
      "

    >

      <div

        className="
          grid
          gap-5
          md:grid-cols-2
        "

      >

        {/* =================================================
            WEIGHT
        ================================================== */}

        <div
          className="space-y-2"
        >

          <Label
            htmlFor="weight"
          >

            Weight (kg)

          </Label>


          <Input

            id="weight"

            type="number"

            min="0"

            step="0.001"

            placeholder="e.g. 0.050"

            {...form.register(
              "weight",
              {
                setValueAs:
                  (value) => {

                    if (
                      value === ""
                    ) {

                      return null;

                    }

                    return Number(
                      value
                    );

                  },
              }
            )}

          />

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >

            Example: 50 grams = 0.050 kg

          </p>

        </div>


        {/* =================================================
            LENGTH
        ================================================== */}

        <div
          className="space-y-2"
        >

          <Label
            htmlFor="length"
          >

            Length (cm)

          </Label>


          <Input

            id="length"

            type="number"

            min="0"

            step="0.01"

            placeholder="e.g. 5.00"

            {...form.register(
              "length",
              {
                setValueAs:
                  (value) => {

                    if (
                      value === ""
                    ) {

                      return null;

                    }

                    return Number(
                      value
                    );

                  },
              }
            )}

          />

        </div>


        {/* =================================================
            WIDTH
        ================================================== */}

        <div
          className="space-y-2"
        >

          <Label
            htmlFor="width"
          >

            Width (cm)

          </Label>


          <Input

            id="width"

            type="number"

            min="0"

            step="0.01"

            placeholder="e.g. 2.00"

            {...form.register(
              "width",
              {
                setValueAs:
                  (value) => {

                    if (
                      value === ""
                    ) {

                      return null;

                    }

                    return Number(
                      value
                    );

                  },
              }
            )}

          />

        </div>


        {/* =================================================
            HEIGHT
        ================================================== */}

        <div
          className="space-y-2"
        >

          <Label
            htmlFor="height"
          >

            Height (cm)

          </Label>


          <Input

            id="height"

            type="number"

            min="0"

            step="0.01"

            placeholder="e.g. 1.00"

            {...form.register(
              "height",
              {
                setValueAs:
                  (value) => {

                    if (
                      value === ""
                    ) {

                      return null;

                    }

                    return Number(
                      value
                    );

                  },
              }
            )}

          />

        </div>

      </div>

    </SectionCard>

  );

}