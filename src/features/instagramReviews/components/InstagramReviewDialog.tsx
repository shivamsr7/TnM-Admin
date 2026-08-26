import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { storageService } from "@/shared/services/storage.service";

import {
  useCreateInstagramCustomerReview,
  useUpdateInstagramCustomerReview,
} from "../hooks/useInstagramCustomerReviews";

import type {
  InstagramCustomerReview,
} from "../types/instagramCustomerReview.types";


/*
 * =========================================================
 * VALIDATION SCHEMA
 * =========================================================
 */

const schema = z.object({

  customer_name:
    z
      .string()
      .min(
        2,
        "Customer name is required"
      ),

  instagram_username:
    z
      .string()
      .optional(),

  review_text:
    z
      .string()
      .optional(),

  rating:
    z
      .number()
      .int()
      .min(
        1,
        "Rating must be at least 1"
      )
      .max(
        5,
        "Rating cannot be more than 5"
      ),

  product_id:
    z
      .string()
      .optional(),

  is_published:
    z
      .boolean(),

  is_featured:
    z
      .boolean(),

  display_order:
    z
      .number()
      .int()
      .min(
        0,
        "Display order cannot be negative"
      ),

});


/*
 * =========================================================
 * FORM TYPE
 * =========================================================
 */

type FormValues =
  z.infer<typeof schema>;


/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface Props {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  review?:
    | InstagramCustomerReview
    | null;

}


/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function InstagramReviewDialog({

  open,

  onOpenChange,

  review = null,

}: Props) {


  /*
   * =======================================================
   * MODE
   * =======================================================
   */

  const isEditing =
    Boolean(review);


  /*
   * =======================================================
   * MUTATIONS
   * =======================================================
   */

  const createReview =
    useCreateInstagramCustomerReview();


  const updateReview =
    useUpdateInstagramCustomerReview();


  /*
   * =======================================================
   * FILE STATE
   * =======================================================
   */

  const [
    file,
    setFile,
  ] = useState<File | null>(
    null
  );


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(
    null
  );


  /*
   * =======================================================
   * FORM
   * =======================================================
   */

  const form =
    useForm<FormValues>({

      resolver:
        zodResolver(
          schema
        ),

      defaultValues: {

        customer_name:
          "",

        instagram_username:
          "",

        review_text:
          "",

        rating:
          5,

        product_id:
          "",

        is_published:
          false,

        is_featured:
          true,

        display_order:
          0,

      },

    });


  /*
   * =======================================================
   * RESET FORM WHEN DIALOG OPENS
   * =======================================================
   */

  useEffect(() => {

    if (!open) {

      return;

    }


    form.reset({

      customer_name:
        review?.customer_name ??
        "",

      instagram_username:
        review?.instagram_username ??
        "",

      review_text:
        review?.review_text ??
        "",

      rating:
        review?.rating ??
        5,

      product_id:
        review?.product_id ??
        "",

      is_published:
        review?.is_published ??
        false,

      is_featured:
        review?.is_featured ??
        true,

      display_order:
        review?.display_order ??
        0,

    });


    setFile(
      null
    );


    setPreviewUrl(
      review?.screenshot_url ??
      null
    );

  }, [
    open,
    review,
    form,
  ]);


  /*
   * =======================================================
   * SUBMIT
   * =======================================================
   */

  async function onSubmit(
    values: FormValues
  ) {

    try {

      setUploading(
        true
      );


      /*
       * Existing screenshot
       */

      let screenshotUrl =
        review?.screenshot_url ??
        "";


      let screenshotPath =
        review?.screenshot_path ??
        "";


      /*
       * =====================================================
       * UPLOAD NEW SCREENSHOT
       * =====================================================
       */

      if (file) {

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          throw new Error(
            "Please select an image file."
          );

        }


        if (
          file.size >
          10 * 1024 * 1024
        ) {

          throw new Error(
            "Image must be 10 MB or smaller."
          );

        }


        const uploaded =
          await storageService.upload(

            file,

            "instagram-reviews"

          );


        screenshotUrl =
          uploaded.publicUrl;


        screenshotPath =
          uploaded.path;

      }


      /*
       * =====================================================
       * SCREENSHOT REQUIRED
       * =====================================================
       */

      if (
        !screenshotUrl ||
        !screenshotPath
      ) {

        throw new Error(
          "Please upload the Instagram DM screenshot."
        );

      }


      /*
       * =====================================================
       * PAYLOAD
       * =====================================================
       */

      const payload = {

        customer_name:
          values.customer_name.trim(),

        instagram_username:
          values.instagram_username?.trim() ||
          "",

        review_text:
          values.review_text?.trim() ||
          "",

        rating:
          values.rating,

        screenshot_url:
          screenshotUrl,

        screenshot_path:
          screenshotPath,

        product_id:
          values.product_id ||
          null,

        is_published:
          values.is_published,

        is_featured:
          values.is_featured,

        display_order:
          values.display_order,

      };


      /*
       * =====================================================
       * UPDATE
       * =====================================================
       */

      if (review) {

        await updateReview.mutateAsync({

          id:
            review.id,

          values:
            payload,

        });


        toast.success(
          "Instagram review updated."
        );

      }


      /*
       * =====================================================
       * CREATE
       * =====================================================
       */

      else {

        await createReview.mutateAsync(
          payload
        );


        toast.success(
          "Instagram review added."
        );

      }


      /*
       * Close dialog
       */

      onOpenChange(
        false
      );

    }

    catch (
      error
    ) {

      toast.error(

        error instanceof Error

          ? error.message

          : "Unable to save Instagram review."

      );

    }

    finally {

      setUploading(
        false
      );

    }

  }


  /*
   * =======================================================
   * SAVING STATE
   * =======================================================
   */

  const saving =
    uploading ||
    createReview.isPending ||
    updateReview.isPending;


  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (

    <Dialog

      open={
        open
      }

      onOpenChange={
        onOpenChange
      }

    >

      <DialogContent
        className="
          max-h-[92vh]
          overflow-y-auto
          sm:max-w-2xl
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <DialogHeader>

          <DialogTitle>

            {isEditing
              ? "Edit Instagram Review"
              : "Add Instagram Review"}

          </DialogTitle>

        </DialogHeader>


        {/* =================================================
            FORM
        ================================================== */}

        <form

          onSubmit={
            form.handleSubmit(
              onSubmit
            )
          }

          className="
            space-y-5
          "

        >

          {/* =================================================
              SCREENSHOT
          ================================================== */}

          <div
            className="
              space-y-2
            "
          >

            <Label>
              Instagram DM Screenshot *
            </Label>


            <label
              className="
                block
                cursor-pointer
              "
            >

              <input

                type="file"

                accept="
                  image/png,
                  image/jpeg,
                  image/webp
                "

                className="
                  sr-only
                "

                onChange={(
                  event
                ) => {

                  const selected =
                    event.target.files?.[0] ??
                    null;


                  setFile(
                    selected
                  );


                  if (selected) {

                    setPreviewUrl(
                      URL.createObjectURL(
                        selected
                      )
                    );

                  }

                }}

              />


              {previewUrl ? (

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    bg-neutral-50
                  "
                >

                  <img

                    src={
                      previewUrl
                    }

                    alt="
                      Instagram review preview
                    "

                    className="
                      mx-auto
                      max-h-80
                      object-contain
                    "

                  />


                  <span
                    className="
                      absolute
                      bottom-3
                      left-1/2
                      -translate-x-1/2
                      rounded-full
                      bg-black/75
                      px-3
                      py-1
                      text-xs
                      text-white
                    "
                  >

                    Click to replace

                  </span>

                </div>

              ) : (

                <div
                  className="
                    flex
                    min-h-44
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border-2
                    border-dashed
                    border-neutral-200
                    bg-neutral-50
                    text-neutral-500
                  "
                >

                  <ImagePlus
                    className="
                      mb-2
                      h-8
                      w-8
                    "
                  />


                  <span
                    className="
                      text-sm
                      font-medium
                    "
                  >

                    Upload Instagram DM screenshot

                  </span>


                  <span
                    className="
                      mt-1
                      text-xs
                    "
                  >

                    JPG, PNG or WEBP · max 10 MB

                  </span>

                </div>

              )}

            </label>

          </div>


          {/* =================================================
              CUSTOMER DETAILS
          ================================================== */}

          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
            "
          >

            {/* Customer Name */}

            <div
              className="
                space-y-2
              "
            >

              <Label
                htmlFor="customer_name"
              >
                Customer Name *
              </Label>


              <Input

                id="customer_name"

                {...form.register(
                  "customer_name"
                )}

              />


              {form.formState.errors.customer_name && (

                <p
                  className="
                    text-xs
                    text-red-600
                  "
                >

                  {
                    form.formState.errors
                      .customer_name
                      .message
                  }

                </p>

              )}

            </div>


            {/* Instagram Username */}

            <div
              className="
                space-y-2
              "
            >

              <Label
                htmlFor="instagram_username"
              >
                Instagram Username
              </Label>


              <Input

                id="instagram_username"

                placeholder="@username"

                {...form.register(
                  "instagram_username"
                )}

              />

            </div>

          </div>


          {/* =================================================
              REVIEW TEXT
          ================================================== */}

          <div
            className="
              space-y-2
            "
          >

            <Label
              htmlFor="review_text"
            >
              Review Text
            </Label>


            <Textarea

              id="review_text"

              rows={4}

              placeholder="
                Optional clean text version of the Instagram review...
              "

              {...form.register(
                "review_text"
              )}

            />

          </div>


          {/* =================================================
              RATING / ORDER / PRODUCT
          ================================================== */}

          <div
            className="
              grid
              gap-5
              sm:grid-cols-3
            "
          >

            {/* Rating */}

            <div
              className="
                space-y-2
              "
            >

              <Label
                htmlFor="rating"
              >
                Rating
              </Label>


              <Input

                id="rating"

                type="number"

                min={1}

                max={5}

                {...form.register(
                  "rating",
                  {
                    valueAsNumber:
                      true,
                  }
                )}

              />


              {form.formState.errors.rating && (

                <p
                  className="
                    text-xs
                    text-red-600
                  "
                >

                  {
                    form.formState.errors
                      .rating
                      .message
                  }

                </p>

              )}

            </div>


            {/* Display Order */}

            <div
              className="
                space-y-2
              "
            >

              <Label
                htmlFor="display_order"
              >
                Story Order
              </Label>


              <Input

                id="display_order"

                type="number"

                min={0}

                {...form.register(
                  "display_order",
                  {
                    valueAsNumber:
                      true,
                  }
                )}

              />


              {form.formState.errors.display_order && (

                <p
                  className="
                    text-xs
                    text-red-600
                  "
                >

                  {
                    form.formState.errors
                      .display_order
                      .message
                  }

                </p>

              )}

            </div>


            {/* Product ID */}

            <div
              className="
                space-y-2
              "
            >

              <Label
                htmlFor="product_id"
              >
                Product ID (optional)
              </Label>


              <Input

                id="product_id"

                placeholder="UUID"

                {...form.register(
                  "product_id"
                )}

              />

            </div>

          </div>


          {/* =================================================
              PUBLISHED / FEATURED
          ================================================== */}

          <div
            className="
              grid
              gap-4
              rounded-xl
              border
              p-4
              sm:grid-cols-2
            "
          >

            {/* Published */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div>

                <Label>
                  Published
                </Label>


                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >

                  Allow this review to appear on the website.

                </p>

              </div>


              <Switch

                checked={
                  form.watch(
                    "is_published"
                  )
                }

                onCheckedChange={(
                  checked
                ) =>

                  form.setValue(
                    "is_published",
                    checked
                  )

                }

              />

            </div>


            {/* Featured */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div>

                <Label>
                  Featured
                </Label>


                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >

                  Include it in the Customer Love stories.

                </p>

              </div>


              <Switch

                checked={
                  form.watch(
                    "is_featured"
                  )
                }

                onCheckedChange={(
                  checked
                ) =>

                  form.setValue(
                    "is_featured",
                    checked
                  )

                }

              />

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================== */}

          <DialogFooter>

            <Button

              type="button"

              variant="outline"

              onClick={() =>
                onOpenChange(
                  false
                )
              }

              disabled={
                saving
              }

            >
              Cancel
            </Button>


            <Button

              type="submit"

              disabled={
                saving
              }

            >

              {saving && (

                <Loader2
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                />

              )}


              {isEditing
                ? "Save Changes"
                : "Add Review"}

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

}