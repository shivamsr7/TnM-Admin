import {
  useFieldArray,
  type UseFormReturn,
} from "react-hook-form";

import { Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import SectionCard from "@/shared/components/admin/SectionCard";

import type {
  ProductSchema,
} from "../../schemas/product.schema";


interface Props {
  form: UseFormReturn<ProductSchema>;
}


/*
 * =========================================================
 * SPECIFICATION OPTIONS
 * =========================================================
 */

const SPECIFICATION_OPTIONS = [

  "Product Type",

  "Material",

  "Plating/Finish",

  "Color",

  "Size",

  "Ring Size",

  "Design/Pattern",

  "Closure",

  "Occasion/Style",

  "Anti Tarnish",

  "Adjustable",

  "What's Included",

  "Dial Shape",

  "Dial Color",

  "Detailing",

  "Movement Type",

  "Wear Type",

  "Best For",

  "Daily Wear",

  "Occasions",

  "Style",

  "Charm Shape",

  "Charms",

  "Feature",

  "Design",

  "Stone Shape",

  "Stone Color",

  "Pendant Style",

  "Chain Type"

] as const;


export default function SpecificationsSection({
  form,
}: Props) {

  const {
    control,
    register,
  } = form;


  const {
    fields,
    append,
    remove,
  } = useFieldArray({

    control,

    name: "specifications",

  });


  return (

    <SectionCard

      title="Product Specifications"

      description="
        Add product details that will be displayed
        in the Specifications section on the storefront.
      "

    >

      <div className="space-y-4">

        {/* Header */}

        {
          fields.length > 0 && (

            <div
              className="
                hidden
                grid-cols-[1fr_1fr_44px]
                gap-4
                px-1
                md:grid
              "
            >

              <Label>
                Specification
              </Label>

              <Label>
                Value
              </Label>

              <span />

            </div>

          )
        }


        {/* Rows */}

        <div className="space-y-3">

          {
            fields.map(
              (field, index) => (

                <div

                  key={field.id}

                  className="
                    grid
                    gap-3
                    rounded-lg
                    border
                    p-4

                    md:grid-cols-[1fr_1fr_44px]
                    md:items-end
                    md:border-0
                    md:p-0
                  "

                >

                  {/* Specification */}

                  <div className="space-y-2">

                    <Label
                      className="md:hidden"
                    >
                      Specification
                    </Label>


                    <select

                      {...register(
                        `specifications.${index}.label`
                      )}

                      className="
                        flex
                        h-10
                        w-full
                        rounded-md
                        border
                        border-input
                        bg-background
                        px-3
                        py-2
                        text-sm
                        ring-offset-background
                        focus:outline-none
                        focus:ring-2
                        focus:ring-ring
                        focus:ring-offset-2
                      "

                    >

                      <option value="">
                        Select specification
                      </option>


                      {
                        SPECIFICATION_OPTIONS.map(
                          option => (

                            <option

                              key={option}

                              value={option}

                            >

                              {option}

                            </option>

                          )
                        )
                      }

                    </select>

                  </div>


                  {/* Value */}

                  <div className="space-y-2">

                    <Label
                      className="md:hidden"
                    >
                      Value
                    </Label>


                    <Input

                      placeholder="
                        e.g. Stainless Steel
                      "

                      {...register(
                        `specifications.${index}.value`
                      )}

                    />

                  </div>


                  {/* Delete */}

                  <Button

                    type="button"

                    variant="outline"

                    size="icon"

                    onClick={() =>
                      remove(index)
                    }

                    className="
                      h-10
                      w-full
                      md:w-10
                    "

                    aria-label="
                      Remove specification
                    "

                  >

                    <Trash2
                      size={16}
                    />

                  </Button>

                </div>

              )
            )

          }

        </div>


        {/* Empty State */}

        {
          fields.length === 0 && (

            <div

              className="
                rounded-lg
                border
                border-dashed
                p-6
                text-center
              "

            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >

                No specifications added yet.

              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                "
              >

                Add details such as material,
                plating, stone, size, weight,
                closure, occasion, etc.

              </p>

            </div>

          )
        }


        {/* Add */}

        <Button

          type="button"

          variant="outline"

          onClick={() =>
            append({

              label: "",

              value: "",

            })
          }

          className="
            gap-2
          "

        >

          <Plus
            size={16}
          />

          Add Specification

        </Button>

      </div>

    </SectionCard>

  );
}