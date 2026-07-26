import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import MediaUploader from "@/shared/components/media/MediaUploader";

import type { Category } from "../types/category.types";
import type { Subcategory } from "../types/subcategory.types";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  category: Category;

  subcategory?: Subcategory | null;

  onSave: (data: {
    name: string;
    description: string;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
  }) => void;

  isSaving?: boolean;
}


export default function SubcategoryFormDialog({
  open,
  onOpenChange,
  category,
  subcategory,
  onSave,
  isSaving = false,
}: Props) {


  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [sortOrder, setSortOrder] =
    useState(0);

  const [isActive, setIsActive] =
    useState(true);



  useEffect(() => {

    if (subcategory) {

      setName(subcategory.name);

      setDescription(
        subcategory.description ?? ""
      );

      setImageUrl(
        subcategory.image_url ?? null
      );

      setSortOrder(
        subcategory.sort_order
      );

      setIsActive(
        subcategory.is_active
      );


    } else {

      setName("");

      setDescription("");

      setImageUrl(null);

      setSortOrder(0);

      setIsActive(true);

    }

  }, [subcategory, open]);





  function handleSubmit() {

    if (!name.trim()) return;


    onSave({

      name,

      description,

      image_url: imageUrl,

      sort_order: sortOrder,

      is_active: isActive,

    });

  }





  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent

        className="
          flex
          max-w-lg
          max-h-[85vh]
          flex-col
          overflow-hidden
          p-0
        "

      >


        {/* Fixed Header */}

        <DialogHeader

          className="
            shrink-0
            border-b
            px-6
            py-4
          "

        >

          <DialogTitle>

            {subcategory
              ? "Edit Subcategory"
              : "Add Subcategory"
            }

          </DialogTitle>


        </DialogHeader>





        {/* Scroll Area */}

        <div

          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-6
            py-5
          "

        >

          <div className="space-y-5">


            <div>

              <Label>
                Category
              </Label>


              <Input

                value={category.name}

                disabled

              />

            </div>





            <div>

              <Label>
                Subcategory Name
              </Label>


              <Input

                value={name}

                onChange={(e)=>
                  setName(e.target.value)
                }

                placeholder="Enter subcategory name"

              />

            </div>





            <div>

              <Label>
                Description
              </Label>


              <Textarea

                rows={3}

                value={description}

                onChange={(e)=>
                  setDescription(e.target.value)
                }

                placeholder="Optional description"

              />

            </div>





            <div>

              <Label>
                Subcategory Image
              </Label>


              <div className="mt-2">

                <MediaUploader

                  folder="subcategories"

                  value={
                    imageUrl
                    ? [
                        {
                          url: imageUrl,
                          isCover: true,
                          sortOrder: 0,
                          persisted: true,
                        },
                      ]
                    : []
                  }


                  onChange={(images)=>{

                    setImageUrl(
                      images[0]?.url ?? null
                    );

                  }}


                  maxImages={1}

                  enableSorting={false}

                  showCoverLabel={false}

                  title="Subcategory Image"

                />


              </div>

            </div>





            <div>

              <Label>
                Sort Order
              </Label>


              <Input

                type="number"

                value={sortOrder}

                onChange={(e)=>
                  setSortOrder(
                    Number(e.target.value)
                  )
                }

              />

            </div>





            <label
              className="
                flex
                items-center
                gap-2
              "
            >

              <input

                type="checkbox"

                checked={isActive}

                onChange={(e)=>
                  setIsActive(
                    e.target.checked
                  )
                }

              />

              Active

            </label>


          </div>


        </div>





        {/* Fixed Footer */}

        <div

          className="
            shrink-0
            flex
            justify-end
            gap-3
            border-t
            bg-white
            px-6
            py-4
          "

        >

          <Button

            variant="outline"

            onClick={()=>
              onOpenChange(false)
            }

          >

            Cancel

          </Button>





          <Button

            onClick={handleSubmit}

            disabled={isSaving}

          >

            {subcategory
              ? "Update"
              : "Create"
            }

          </Button>


        </div>


      </DialogContent>


    </Dialog>

  );

}