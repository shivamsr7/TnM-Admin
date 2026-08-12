import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "sonner";

import {
  Button,
} from "@/components/ui/button";


/*
 * =========================================================
 * CATEGORY / PRODUCT HOOKS
 * =========================================================
 */

import {
  useCategories,
} from "@/features/categories/hooks/useCategories";

import {
  useSubcategories,
} from "@/features/categories/hooks/useSubcategories";

import {
  useBrands,
} from "@/features/brands/hooks/useBrands";

import {
  useCollections,
} from "@/features/collections/hooks/useCollections";

import {
  useTags,
} from "@/features/tags/hooks/useTags";


/*
 * =========================================================
 * PRODUCT SECTIONS
 * =========================================================
 */

import BasicInfoSection
  from "./sections/BasicInfoSection";

import SpecificationsSection
  from "./sections/SpecificationsSection";

import PricingSection
  from "./sections/PricingSection";

import InventorySection
  from "./sections/InventorySection";

import OrganizationSection
  from "./sections/OrganizationSection";

import ImagesSection
  from "./sections/ImagesSection";

import SeoSection
  from "./sections/SeoSection";

import StatusSection
  from "./sections/StatusSection";


/*
 * =========================================================
 * PRODUCT SERVICES
 * =========================================================
 */

import {
  productService,
} from "../services/product.service";

import {
  productImageService,
} from "../services/productImage.service";


/*
 * =========================================================
 * TYPES
 * =========================================================
 */

import type {
  ProductImage,
} from "@/shared/components/media/MediaUploader";

import type {
  MediaUploaderHandle,
} from "@/shared/components/media/MediaUploader";

import {
  productSchema,
  type ProductSchema,
} from "../schemas/product.schema";


/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface ProductFormProps {
  mode?: "create" | "edit";
  productId?: string;
}


/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function ProductForm({
  mode = "create",
  productId,
}: ProductFormProps) {

  const navigate =
    useNavigate();


  /*
   * =======================================================
   * LOCAL STATE
   * =======================================================
   */

  const [
    images,
    setImages,
  ] = useState<ProductImage[]>([]);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const mediaUploaderRef =
    useRef<MediaUploaderHandle>(null);


  /*
   * =======================================================
   * CATEGORIES
   * =======================================================
   */

  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useCategories();


  /*
   * =======================================================
   * BRANDS
   * =======================================================
   */

  const {
    data: brands = [],
    isLoading: loadingBrands,
  } = useBrands();


  /*
   * =======================================================
   * COLLECTIONS
   * =======================================================
   */

  const {
    data: collections = [],
    isLoading: loadingCollections,
  } = useCollections();


  /*
   * =======================================================
   * TAGS
   * =======================================================
   */

  const {
    data: tags = [],
    isLoading: loadingTags,
  } = useTags();


  /*
   * =======================================================
   * FORM
   * =======================================================
   */

  const form =
    useForm<ProductSchema>({

      resolver:
        zodResolver(productSchema),


      defaultValues: {

        name: "",

        slug: "",

        category_id: "",

        subcategory_id: "",

        brand_id: null,

        short_description: "",

        description: "",

        care_instructions: "",


        /*
         * Product specifications
         */

        specifications: [],


        cost_price: 0,

        price: 0,

        compare_price: 0,

        sku: "",

        barcode: "",

        stock: 0,

        low_stock_threshold: 5,

        track_inventory: true,

        allow_backorders: false,

        status: "draft",

        collection_ids: [],

        tag_ids: [],

        featured: false,

        new_arrival: false,

        best_seller: false,

        trending: false,

        editors_pick: false,

        seo_title: "",

        seo_description: "",

        meta_keywords: "",

      },

    });


  /*
   * =======================================================
   * SELECTED CATEGORY
   * =======================================================
   */

  const selectedCategory =
    form.watch(
      "category_id"
    );


  /*
   * =======================================================
   * SUBCATEGORIES
   * =======================================================
   */

  const {

    data: subcategories = [],

    isLoading:
      loadingSubcategories,

  } = useSubcategories(
    selectedCategory ||
    undefined
  );


  /*
   * =======================================================
   * RESET SUBCATEGORY WHEN CATEGORY CHANGES
   * =======================================================
   */

  useEffect(() => {

    form.setValue(
      "subcategory_id",
      ""
    );

  }, [
    selectedCategory,
    form,
  ]);


  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

  const isLoading =
    useMemo(() => {

      return (

        loadingCategories ||

        loadingBrands ||

        loadingCollections ||

        loadingTags ||

        loadingSubcategories

      );

    }, [

      loadingCategories,

      loadingBrands,

      loadingCollections,

      loadingTags,

      loadingSubcategories,

    ]);


  /*
   * =======================================================
   * EDIT PRODUCT
   * =======================================================
   */

  useEffect(() => {

    if (
      mode !== "edit" ||
      !productId
    ) {

      return;

    }


    const id =
      productId;


    async function loadProduct() {

      try {

        const product =
          await productService.getById(
            id
          );


        /*
         * =================================================
         * CONVERT DATABASE JSONB
         * → FORM ARRAY
         * =================================================
         *
         * Database:
         *
         * {
         *   "base_metal": "Stainless Steel",
         *   "plating": "18k Gold Tone"
         * }
         *
         * Form:
         *
         * [
         *   {
         *     label: "Base Metal",
         *     value: "Stainless Steel"
         *   }
         * ]
         */

        const specificationRows =

          product?.specifications &&
          typeof product.specifications ===
            "object" &&
          !Array.isArray(
            product.specifications
          )

            ? Object.entries(
                product.specifications
              ).map(
                ([key, value]) => ({

                  label:
                    key
                      .replace(
                        /_/g,
                        " "
                      )
                      .replace(
                        /\b\w/g,
                        char =>
                          char.toUpperCase()
                      ),

                  value:
                    String(
                      value ?? ""
                    ),

                })
              )

            : [];


        /*
         * =================================================
         * RESET FORM
         * =================================================
         */

        form.reset({

          ...product,


          /*
           * Convert specifications
           */

          specifications:
            specificationRows,


          /*
           * Collections
           */

          collection_ids:

            product
              .product_collections
              ?.map(
                (
                  item: {
                    collection_id: string;
                  }
                ) =>
                  item.collection_id
              ) ?? [],


          /*
           * Tags
           */

          tag_ids:

            product
              .product_tags
              ?.map(
                (
                  item: {
                    tag_id: string;
                  }
                ) =>
                  item.tag_id
              ) ?? [],

        });


        /*
         * =================================================
         * LOAD PRODUCT IMAGES
         * =================================================
         */

        const productImages =
          await productImageService
            .getByProduct(id);


        setImages(

          productImages.map(
            image => ({

              id:
                image.id,

              url:
                image.image_url,

              path:
                image.storage_path ??
                "",

              isCover:
                image.is_primary,

              sortOrder:
                image.sort_order,

            })
          )

        );

      }

      catch (error) {

        console.error(
          error
        );

        toast.error(
          "Failed to load product."
        );

      }

    }


    loadProduct();

  }, [
    mode,
    productId,
    form,
  ]);


  /*
   * =========================================================
   * FORM SUBMIT
   * =========================================================
   */

  async function onSubmit(
    values: ProductSchema
  ) {

    try {

      setSaving(
        true
      );


      /*
       * =====================================================
       * EXTRACT RELATIONSHIP DATA
       * =====================================================
       */

      const {

        collection_ids = [],

        tag_ids = [],

        specifications = [],

        ...productData

      } = values;


      /*
       * =====================================================
       * CONVERT SPECIFICATIONS
       * =====================================================
       *
       * Form:
       *
       * [
       *   {
       *     label: "Base Metal",
       *     value: "Stainless Steel"
       *   },
       *   {
       *     label: "Plating",
       *     value: "18k Gold Tone"
       *   }
       * ]
       *
       * Database:
       *
       * {
       *   base_metal: "Stainless Steel",
       *   plating: "18k Gold Tone"
       * }
       */

      const specificationsObject =
        Object.fromEntries(

          specifications

            .filter(
              item =>
                item.label.trim() &&
                item.value.trim()
            )

            .map(
              item => [

                item.label
                  .trim()
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "_"
                  ),

                item.value.trim(),

              ]
            )

        );


      /*
       * =====================================================
       * PRODUCT PAYLOAD
       * =====================================================
       */

      const payload = {

        ...productData,


        /*
         * Empty subcategory must be NULL
         */

        subcategory_id:
          productData
            .subcategory_id ||
          null,


        /*
         * Save specifications as JSONB
         */

        specifications:
          specificationsObject,

      };


      /*
       * =====================================================
       * REMOVE EMPTY SKU
       * =====================================================
       */

      if (
        !payload.sku?.trim()
      ) {

        delete payload.sku;

      }


      /*
       * =====================================================
       * CREATE / UPDATE PRODUCT
       * =====================================================
       */

      let product;


      if (
        mode === "create"
      ) {

        product =
          await productService.create(
            payload
          );

      }

      else {

        if (!productId) {

          throw new Error(
            "Product ID is missing."
          );

        }


        product =
          await productService.update(
            productId,
            payload
          );

      }


      console.log(
        "Saved product:",
        product
      );


      console.log(
        "Images:",
        images
      );


      /*
       * =====================================================
       * SAVE PRODUCT IMAGES
       * =====================================================
       */

      if (
        mode === "create"
      ) {

        if (
          images.length > 0
        ) {

          await productImageService
            .saveMany(
              product.id,
              images
            );

        }

      }

      else {

        await productImageService
          .deleteByProduct(
            product.id
          );


        if (
          images.length > 0
        ) {

          await productImageService
            .saveMany(
              product.id,
              images
            );

        }

      }


      /*
       * =====================================================
       * COLLECTIONS + TAGS
       * =====================================================
       */

      if (
        mode === "create"
      ) {

        /*
         * Collections
         */

        if (
          collection_ids.length > 0
        ) {

          await productService
            .createProductCollections(
              product.id,
              collection_ids
            );

        }


        /*
         * Tags
         */

        if (
          tag_ids.length > 0
        ) {

          await productService
            .createProductTags(
              product.id,
              tag_ids
            );

        }

      }

      else {

        /*
         * Replace collections
         */

        await productService
          .replaceProductCollections(
            product.id,
            collection_ids
          );


        /*
         * Replace tags
         */

        await productService
          .replaceProductTags(
            product.id,
            tag_ids
          );

      }


      /*
       * =====================================================
       * SUCCESS
       * =====================================================
       */

      toast.success(

        mode === "create"

          ? "Product created successfully."

          : "Product updated successfully."

      );


      /*
       * Tell MediaUploader
       * files are permanent
       */

      mediaUploaderRef
        .current
        ?.markAsSaved();


      /*
       * Reset form
       */

      form.reset();


      /*
       * Clear images
       */

      setImages([]);


      /*
       * Go back to products
       */

      navigate(
        "/products"
      );

    }

    catch (error) {

      console.error(
        "Product save failed:",
        error
      );


      toast.error(

        error instanceof Error

          ? error.message

          : "Failed to save product"

      );

    }

    finally {

      setSaving(
        false
      );

    }

  }


  /*
   * =========================================================
   * LOADING SCREEN
   * =========================================================
   */

  if (
    isLoading
  ) {

    return (

      <div
        className="
          flex
          h-80
          items-center
          justify-center
        "
      >

        Loading...

      </div>

    );

  }


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (

    <form

      onSubmit={
        form.handleSubmit(
          onSubmit
        )
      }

      className="
        space-y-8
      "

    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div

        className="
          flex
          flex-col
          gap-4
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm

          md:flex-row
          md:items-center
          md:justify-between
        "

      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
            "
          >

            {
              mode === "create"
                ? "Add Product"
                : "Edit Product"
            }

          </h1>


          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >

            {
              mode === "create"

                ? "Create a new product for your store."

                : "Update your product details."
            }

          </p>

        </div>


        <div
          className="
            flex
            gap-3
          "
        >

          <Button

            type="button"

            variant="outline"

            onClick={() =>
              navigate(-1)
            }

          >

            Cancel

          </Button>


          <Button

            type="submit"

            disabled={
              saving ||
              isLoading
            }

          >

            {
              saving

                ? mode === "create"
                  ? "Saving Product..."
                  : "Updating Product..."

                : mode === "create"
                  ? "Save Product"
                  : "Update Product"
            }

          </Button>

        </div>

      </div>


      {/* =====================================================
          BASIC INFORMATION
      ====================================================== */}

      <BasicInfoSection
        form={form}
      />


      {/* =====================================================
          PRODUCT SPECIFICATIONS
      ====================================================== */}

      <SpecificationsSection
        form={form}
      />


      {/* =====================================================
          PRICING + INVENTORY
      ====================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        <PricingSection
          form={form}
        />

        <InventorySection
          form={form}
        />

      </div>


      {/* =====================================================
          ORGANIZATION + STATUS
      ====================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        <OrganizationSection

          form={form}

          categories={
            categories
          }

          subcategories={
            subcategories
          }

          brands={
            brands
          }

          collections={
            collections
          }

          tags={
            tags
          }

        />


        <StatusSection
          form={form}
        />

      </div>


      {/* =====================================================
          IMAGES
      ====================================================== */}

      <ImagesSection

        images={
          images
        }

        setImages={
          setImages
        }

        uploaderRef={
          mediaUploaderRef
        }

      />


      {/* =====================================================
          SEO
      ====================================================== */}

      <SeoSection
        form={form}
      />


      {/* =====================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <div

        className="
          sticky
          bottom-0
          z-20

          flex
          flex-col
          gap-3

          rounded-xl
          border

          bg-background/95

          p-4

          backdrop-blur

          md:flex-row
          md:justify-end
        "

      >

        <Button

          type="button"

          variant="outline"

          onClick={() =>
            navigate(-1)
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

          {
            saving

              ? mode === "create"
                ? "Saving Product..."
                : "Updating Product..."

              : mode === "create"
                ? "Save Product"
                : "Update Product"
          }

        </Button>

      </div>

    </form>

  );

}