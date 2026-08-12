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

                  {/* Label */}

                  <div className="space-y-2">

                    <Label
                      className="md:hidden"
                    >
                      Specification
                    </Label>

                    <Input

                      placeholder="
                        e.g. Base Metal
                      "

                      {...register(
                        `specifications.${index}.label`
                      )}

                    />

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
                plating, closure type, stone,
                movement, etc.

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