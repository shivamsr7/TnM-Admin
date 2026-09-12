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

import {
  ArrowLeft,
  Boxes,
  Check,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Image as ImageIcon,
  LayoutList,
  Loader2,
  Package,
  Search,
  Settings2,
  Tags,
  Truck,

  ChevronRight,
  Sparkles,} from "lucide-react";


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

import DimensionsSection
  from "./sections/DimensionsSection";

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


/*
 * =========================================================
 * SCHEMA
 * =========================================================
 */

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

  mode?:
    | "create"
    | "edit";

  productId?:
    string;

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
  ] =
    useState<ProductImage[]>(
      []
    );


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  /*
   * =========================================================
   * RING SIZE AVAILABILITY
   * =========================================================
   */

  const RING_SIZES = Array.from(
  { length: 25 },
  (_, index) => String(index + 6)
);

  const [
    ringSizes,
    setRingSizes,
  ] = useState<string[]>([]);


  const mediaUploaderRef =
    useRef<MediaUploaderHandle>(
      null
    );


  /*
   * =======================================================
   * CATEGORIES
   * =======================================================
   */

  const {

    data:
      categories = [],

    isLoading:
      loadingCategories,

  } =
    useCategories();


  /*
   * =======================================================
   * BRANDS
   * =======================================================
   */

  const {

    data:
      brands = [],

    isLoading:
      loadingBrands,

  } =
    useBrands();


  /*
   * =======================================================
   * COLLECTIONS
   * =======================================================
 */

  const {

    data:
      collections = [],

    isLoading:
      loadingCollections,

  } =
    useCollections();


  /*
   * =======================================================
   * TAGS
   * =======================================================
   */

  const {

    data:
      tags = [],

    isLoading:
      loadingTags,

  } =
    useTags();


  /*
   * =======================================================
   * FORM
   * =======================================================
   */

  const form =
    useForm<ProductSchema>({

      resolver:
        zodResolver(
          productSchema
        ),


      defaultValues: {

        name:
          "",

        slug:
          "",

        category_id:
          "",

        subcategory_id:
          "",

        brand_id:
          null,

        short_description:
          "",

        description:
          "",

        care_instructions:
          "",


        /*
         * Specifications
         */

        specifications:
          [],


        /*
         * Weight & dimensions
         */

        weight:
          null,

        length:
          null,

        width:
          null,

        height:
          null,


        /*
         * Pricing
         */

        cost_price:
          0,

        price:
          0,

        compare_price:
          0,


        /*
         * Special Product Discount
         */

        special_discount_enabled:
          false,

        special_discount_type:
          "percentage",

        special_discount_value:
          0,

        special_discount_ends_at:
          null,


        /*
         * Identification
         */

        sku:
          "",

        barcode:
          "",


        /*
         * Inventory
         */

        stock:
          0,

        low_stock_threshold:
          5,

        track_inventory:
          true,

        allow_backorders:
          false,


        /*
         * Status
         */

        status:
          "draft",


        /*
         * Relationships
         */

        collection_ids:
          [],

        tag_ids:
          [],


        /*
         * Product flags
         */

        featured:
          false,

        new_arrival:
          false,

        best_seller:
          false,

        trending:
          false,

        editors_pick:
          false,


        /*
         * SEO
         */

        seo_title:
          "",

        seo_description:
          "",

        meta_keywords:
          "",

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


  const selectedCategoryName =
    categories.find(
      (category: any) =>
        category.id === selectedCategory
    )?.name ?? "";


  const isRingProduct =
    selectedCategoryName
      .trim()
      .toLowerCase() === "rings";


  /*
   * =======================================================
   * SUBCATEGORIES
   * =======================================================
   */

  const {

    data:
      subcategories = [],

  } =
    useSubcategories(
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


  useEffect(() => {

    if (!isRingProduct) {
      setRingSizes([]);
    }

  }, [
    isRingProduct,
  ]);


  /*
   * =======================================================
   * LOADING
   * =======================================================
   *
   * IMPORTANT:
   * loadingSubcategories is intentionally NOT included here.
   *
   * When category changes, the subcategory query loads in the
   * background. The complete ProductForm should remain visible.
   * =======================================================
   */

  const isLoading =
    useMemo(() => {

      return (

        loadingCategories ||

        loadingBrands ||

        loadingCollections ||

        loadingTags

      );

    }, [

      loadingCategories,

      loadingBrands,

      loadingCollections,

      loadingTags,

    ]);


  /*
   * =======================================================
   * LOAD PRODUCT FOR EDIT
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
         * CONVERT JSONB SPECIFICATIONS
         * → FORM ARRAY
         * =================================================
         */

        const existingRingSizes =
          product?.specifications &&
          typeof product.specifications === "object" &&
          !Array.isArray(product.specifications) &&
          Array.isArray(
            (product.specifications as any).ring_sizes
          )
            ? (product.specifications as any).ring_sizes
                .map((size: any) => String(size))
                .filter((size: string) =>
                  RING_SIZES.includes(size)
                )
            : [];


        setRingSizes(
          existingRingSizes
        );


        const specificationRows =

          product?.specifications &&

          typeof product.specifications ===
            "object" &&

          !Array.isArray(
            product.specifications
          )

            ? Object.entries(
                product.specifications
              )
                .filter(
                  ([key]) =>
                    key !== "ring_sizes"
                )
                .map(
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

          /*
           * Basic information
           */

          name:
            product.name ??
            "",

          slug:
            product.slug ??
            "",

          category_id:
            product.category_id ??
            "",

          subcategory_id:
            product.subcategory_id ??
            "",

          brand_id:
            product.brand_id ??
            null,

          short_description:
            product.short_description ??
            "",

          description:
            product.description ??
            "",

          care_instructions:
            product.care_instructions ??
            "",


          /*
           * Specifications
           */

          specifications:
            specificationRows,


          /*
           * Weight & dimensions
           */

          weight:
            product.weight ??
            null,

          length:
            product.length ??
            null,

          width:
            product.width ??
            null,

          height:
            product.height ??
            null,


          /*
           * Pricing
           */

          cost_price:
            product.cost_price ??
            0,

          price:
            product.price ??
            0,

          compare_price:
            product.compare_price ??
            0,


          /*
           * Special Product Discount
           */

          special_discount_enabled:
            product.special_discount_enabled ??
            false,

          special_discount_type:
            product.special_discount_type ??
            "percentage",

          special_discount_value:
            product.special_discount_value ??
            0,

          special_discount_ends_at:
            product.special_discount_ends_at ??
            null,


          /*
           * Identification
           */

          sku:
            product.sku ??
            "",

          barcode:
            product.barcode ??
            "",


          /*
           * Inventory
           */

          stock:
            product.stock ??
            0,

          low_stock_threshold:
            product.low_stock_threshold ??
            5,

          track_inventory:
            product.track_inventory ??
            true,

          allow_backorders:
            product.allow_backorders ??
            false,


          /*
           * Status
           */

          status:
            product.status ??
            "draft",


          /*
           * Product flags
           */

          featured:
            product.featured ??
            false,

          new_arrival:
            product.new_arrival ??
            false,

          best_seller:
            product.best_seller ??
            false,

          trending:
            product.trending ??
            false,

          editors_pick:
            product.editors_pick ??
            false,


          /*
           * Collections
           */

          collection_ids:

            product
              .product_collections
              ?.map(
                (
                  item: {
                    collection_id:
                      string;
                  }
                ) =>
                  item.collection_id
              ) ??

            [],


          /*
           * Tags
           */

          tag_ids:

            product
              .product_tags
              ?.map(
                (
                  item: {
                    tag_id:
                      string;
                  }
                ) =>
                  item.tag_id
              ) ??

            [],


          /*
           * SEO
           */

          seo_title:
            product.seo_title ??
            "",

          seo_description:
            product.seo_description ??
            "",

          meta_keywords:
            product.meta_keywords ??
            "",

        });


        /*
         * =================================================
         * LOAD PRODUCT IMAGES
         * =================================================
         */

        const productImages =
          await productImageService
            .getByProduct(
              id
            );


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

      catch (
        error
      ) {

        console.error(
          "Failed to load product:",
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
   * =======================================================
   * SUBMIT
   * =======================================================
   */

  async function onSubmit(
    values: ProductSchema
  ) {

    try {

      setSaving(
        true
      );


      /*
       * =================================================
       * SEPARATE FORM-ONLY FIELDS
       * =================================================
       */

      const {

        collection_ids =
          [],

        tag_ids =
          [],

        specifications =
          [],

        ...productData

      } =
        values;


      /*
       * =================================================
       * CONVERT SPECIFICATIONS
       * → JSONB
       * =================================================
       */

      const specificationsObject: Record<
  string,
  string | string[]
> =
  Object.fromEntries(

          specifications

            .filter(
              item =>

                item.label
                  .trim()
                  .length > 0 &&

                item.value
                  .trim()
                  .length > 0

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

                item.value
                  .trim(),

              ]
            )

        );


      /*
       * Ring sizes are stored alongside the existing
       * specifications JSONB, but only for Ring products.
       */

      if (isRingProduct) {

        specificationsObject.ring_sizes =
          ringSizes;

      }


      /*
       * =================================================
       * FINAL PRODUCT PAYLOAD
       * =================================================
       */

      const payload = {

        ...productData,


        /*
         * Empty subcategory → NULL
         */

        subcategory_id:
          productData
            .subcategory_id ||
          null,


        /*
         * Specifications → JSONB
         */

        specifications:
          specificationsObject,

      };


      /*
       * =================================================
       * REMOVE EMPTY SKU
       * =================================================
       */

      if (
        !payload.sku?.trim()
      ) {

        delete payload.sku;

      }


      /*
       * =================================================
       * CREATE / UPDATE
       * =================================================
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

        if (
          !productId
        ) {

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


      /*
       * =================================================
       * SAVE IMAGES
       * =================================================
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
       * =================================================
       * COLLECTIONS + TAGS
       * =================================================
       */

      if (
        mode === "create"
      ) {

        if (
          collection_ids.length > 0
        ) {

          await productService
            .createProductCollections(
              product.id,
              collection_ids
            );

        }


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

        await productService
          .replaceProductCollections(
            product.id,
            collection_ids
          );


        await productService
          .replaceProductTags(
            product.id,
            tag_ids
          );

      }


      /*
       * =================================================
       * SUCCESS
       * =================================================
       */

      toast.success(

        mode === "create"

          ? "Product created successfully."

          : "Product updated successfully."

      );


      mediaUploaderRef
        .current
        ?.markAsSaved();


      form.reset();


      setRingSizes([]);


      setImages(
        []
      );


      navigate(
        "/products"
      );

    }

    catch (
      error
    ) {

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
   * =======================================================
   * LOADING SCREEN
   * =======================================================
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
   * =======================================================
   * LIVE PAGE SUMMARY
   * =======================================================
   */

  const watchedName =
    form.watch("name") || "";

  const watchedCategory =
    form.watch("category_id") || "";

  const watchedPrice =
    Number(form.watch("price")) || 0;

  const watchedStock =
    Number(form.watch("stock")) || 0;





  






  const saveLabel =
    saving
      ? mode === "create"
        ? "Creating product..."
        : "Saving changes..."
      : mode === "create"
        ? "Create Product"
        : "Save Changes";

  /*
   * =======================================================
   * GUIDED PRODUCT WIZARD
   * =======================================================
   */

  type WizardStep = {
    id: string;
    label: string;
    shortLabel: string;
    icon: typeof FileText;
  };

  const baseSteps: WizardStep[] = [
    {
      id: "basic",
      label: "Basic Information",
      shortLabel: "Basic Info",
      icon: FileText,
    },
    {
      id: "specifications",
      label: "Specifications",
      shortLabel: "Specs",
      icon: Tags,
    },
    ...(isRingProduct
      ? [
          {
            id: "ring-sizes",
            label: "Ring Sizes",
            shortLabel: "Ring Sizes",
            icon: Settings2,
          },
        ]
      : []),
    {
      id: "dimensions",
      label: "Weight & Dimensions",
      shortLabel: "Dimensions",
      icon: Truck,
    },
    {
      id: "pricing",
      label: "Pricing",
      shortLabel: "Pricing",
      icon: CircleDollarSign,
    },
    {
      id: "inventory",
      label: "Inventory",
      shortLabel: "Inventory",
      icon: Boxes,
    },
    {
      id: "organization",
      label: "Organization",
      shortLabel: "Organization",
      icon: LayoutList,
    },
    {
      id: "images",
      label: "Product Images",
      shortLabel: "Images",
      icon: ImageIcon,
    },
    {
      id: "seo",
      label: "Search Engine Optimization",
      shortLabel: "SEO",
      icon: Search,
    },
    {
      id: "status",
      label: "Publishing & Visibility",
      shortLabel: "Publishing",
      icon: Package,
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  /*
   * If category changes while the wizard is open and Ring Sizes
   * disappears, keep the current step inside the valid range.
   */
  useEffect(() => {
    setCurrentStep((step) =>
      Math.min(step, baseSteps.length - 1)
    );
  }, [baseSteps.length, isRingProduct]);

  const currentWizardStep =
    baseSteps[currentStep] ?? baseSteps[0];

  /*
   * Section completion is intentionally lightweight. It is used
   * for the progress UI; actual Continue validation uses RHF.
   */
  const isStepComplete = (stepId: string) => {
    switch (stepId) {
      case "basic":
        return Boolean(
          watchedName.trim() &&
            form.watch("description")?.trim()
        );

      case "specifications":
        return (
          (form.watch("specifications")?.length ?? 0) > 0
        );

      case "ring-sizes":
        return ringSizes.length > 0;

      case "dimensions":
        return Boolean(
          form.watch("weight") !== null &&
            form.watch("weight") !== undefined
        );

      case "pricing":
        return watchedPrice > 0;

      case "inventory":
        return Boolean(
          form.watch("stock") !== undefined
        );

      case "organization":
        return Boolean(watchedCategory);

      case "images":
        return images.length > 0;

      case "seo":
        return Boolean(
          form.watch("seo_title")?.trim()
        );

      case "status":
        return Boolean(form.watch("status"));

      default:
        return false;
    }
  };

  const completedStepCount = baseSteps.filter(
    (step) => isStepComplete(step.id)
  ).length;

  const progressPercent = Math.round(
    ((currentStep + 1) / baseSteps.length) * 100
  );

  const wizardCompletionPercent = Math.round(
    (completedStepCount / baseSteps.length) * 100
  );

  /*
   * Validate only the fields belonging to the current step.
   * This keeps the wizard focused and does not alter the final
   * submit/schema logic.
   */
  const validateCurrentStep = async () => {
    let valid = true;

    switch (currentWizardStep.id) {
      case "basic":
        valid = await form.trigger([
          "name",
          "slug",
          "short_description",
          "description",
          "care_instructions",
        ]);
        break;

      case "specifications":
        valid = await form.trigger("specifications");
        break;

      case "ring-sizes":
        if (ringSizes.length === 0) {
          toast.error("Select at least one ring size to continue.");
          return false;
        }
        valid = true;
        break;

      case "dimensions":
        valid = await form.trigger([
          "weight",
          "length",
          "width",
          "height",
        ]);
        break;

      case "pricing":
        valid = await form.trigger([
          "cost_price",
          "price",
          "compare_price",
          "special_discount_enabled",
          "special_discount_type",
          "special_discount_value",
          "special_discount_ends_at",
        ]);
        break;

      case "inventory":
        valid = await form.trigger([
          "stock",
          "low_stock_threshold",
          "track_inventory",
          "allow_backorders",
        ]);
        break;

      case "organization":
        valid = await form.trigger([
          "category_id",
          "subcategory_id",
          "brand_id",
          "collection_ids",
          "tag_ids",
          "featured",
          "new_arrival",
          "best_seller",
          "trending",
          "editors_pick",
        ]);
        break;

      case "images":
        if (images.length === 0) {
          toast.error("Add at least one product image to continue.");
          return false;
        }
        valid = true;
        break;

      case "seo":
        valid = await form.trigger([
          "seo_title",
          "seo_description",
          "meta_keywords",
        ]);
        break;

      case "status":
        valid = await form.trigger("status");
        break;
    }

    if (!valid) {
      toast.error(
        "Please complete the highlighted fields before continuing."
      );
    }

    return valid;
  };

  const goNext = async () => {
    const valid = await validateCurrentStep();

    if (!valid) return;

    if (currentStep < baseSteps.length - 1) {
      setCurrentStep((step) => step + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goToStep = (index: number) => {
    /*
     * Only completed/current steps are directly navigable.
     * This prevents accidentally skipping required setup.
     */
    if (
      index <= currentStep ||
      index < completedStepCount
    ) {
      setCurrentStep(index);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const isLastStep =
    currentStep === baseSteps.length - 1;

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="min-w-0 pb-28"
    >
      {/* Header */}
      <header className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
        <div className="relative px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-slate-100 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-amber-50 blur-3xl" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to products
              </button>

              <div className="flex items-start gap-3.5">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white sm:flex">
                  <Package className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      {mode === "create"
                        ? "Add a new product"
                        : "Edit product"}
                    </h1>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Step {currentStep + 1} of {baseSteps.length}
                    </span>
                  </div>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                    Complete each section one at a time. Your product will
                    only be saved when you click the final button.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Setup
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {wizardCompletionPercent}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overall progress */}
      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Product setup
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {currentWizardStep.label}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">
              {progressPercent}%
            </p>
            <p className="text-[10px] text-slate-400">
              Step {currentStep + 1}/{baseSteps.length}
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-950 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Desktop step navigation */}
        <div className="mt-4 hidden grid-cols-5 gap-2 lg:grid xl:grid-cols-10">
          {baseSteps.map((step, index) => {
            const Icon = step.icon;
            const completed = isStepComplete(step.id);
            const active = index === currentStep;
            const clickable =
              index <= currentStep ||
              index < completedStepCount;

            return (
              <button
                key={step.id}
                type="button"
                disabled={!clickable}
                onClick={() => goToStep(index)}
                className={`group rounded-xl border p-2.5 text-left transition ${
                  active
                    ? "border-slate-950 bg-slate-950 text-white"
                    : completed
                      ? "border-emerald-100 bg-emerald-50/60 text-slate-800"
                      : clickable
                        ? "border-slate-200 bg-white hover:bg-slate-50"
                        : "cursor-not-allowed border-slate-100 bg-slate-50/50 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      active
                        ? "bg-white/10"
                        : completed
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {completed && !active ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </span>

                  <span
                    className={`text-[9px] font-bold ${
                      active ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p
                  className={`mt-2 truncate text-[10px] font-semibold ${
                    active ? "text-white" : ""
                  }`}
                >
                  {step.shortLabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* Mobile step navigation */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
          {baseSteps.map((step, index) => {
            const completed = isStepComplete(step.id);
            const active = index === currentStep;
            const clickable =
              index <= currentStep ||
              index < completedStepCount;

            return (
              <button
                key={step.id}
                type="button"
                disabled={!clickable}
                onClick={() => goToStep(index)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold ${
                  active
                    ? "bg-slate-950 text-white"
                    : completed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {completed && !active && (
                  <Check className="h-3 w-3" />
                )}
                {index + 1}. {step.shortLabel}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_250px] xl:grid-cols-[minmax(0,1fr)_270px]">
        {/* Main step */}
        <main className="min-w-0">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  {(() => {
                    const Icon = currentWizardStep.icon;
                    return <Icon className="h-4.5 w-4.5" />;
                  })()}
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Section {currentStep + 1}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    {currentWizardStep.label}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {currentWizardStep.id === "basic" &&
                      "Start with the product identity and customer-facing details."}
                    {currentWizardStep.id === "specifications" &&
                      "Add the important product characteristics customers need."}
                    {currentWizardStep.id === "ring-sizes" &&
                      "Choose every ring size available for this product."}
                    {currentWizardStep.id === "dimensions" &&
                      "Add weight and measurements for accurate product and shipping information."}
                    {currentWizardStep.id === "pricing" &&
                      "Set your costs, selling price and any special product offer."}
                    {currentWizardStep.id === "inventory" &&
                      "Set stock levels and decide how inventory should behave."}
                    {currentWizardStep.id === "organization" &&
                      "Place the product in the right categories, collections and storefront sections."}
                    {currentWizardStep.id === "images" &&
                      "Add the images that will make customers want to see the product."}
                    {currentWizardStep.id === "seo" &&
                      "Prepare the product for search engines and Google previews."}
                    {currentWizardStep.id === "status" &&
                      "Choose how the product should appear on your storefront."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {currentWizardStep.id === "basic" && (
                <BasicInfoSection form={form} />
              )}

              {currentWizardStep.id === "specifications" && (
                <SpecificationsSection form={form} />
              )}

              {currentWizardStep.id === "ring-sizes" && (
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="mb-5 grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-9">
                    {RING_SIZES.map((size) => {
                      const selected = ringSizes.includes(size);

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setRingSizes((current) =>
                              current.includes(size)
                                ? current.filter(
                                    (item) => item !== size
                                  )
                                : [...current, size].sort(
                                    (a, b) =>
                                      Number(a) - Number(b)
                                  )
                            );
                          }}
                          className={`relative flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                            selected
                              ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          {size}
                          {selected && (
                            <Check className="absolute right-1.5 top-1.5 h-2.5 w-2.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-500">
                      {ringSizes.length > 0
                        ? `${ringSizes.length} size${ringSizes.length === 1 ? "" : "s"} selected`
                        : "No ring sizes selected"}
                    </p>

                    {ringSizes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setRingSizes([])}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                      >
                        Clear sizes
                      </button>
                    )}
                  </div>
                </section>
              )}

              {currentWizardStep.id === "dimensions" && (
                <DimensionsSection form={form} />
              )}

              {currentWizardStep.id === "pricing" && (
                <PricingSection form={form} />
              )}

              {currentWizardStep.id === "inventory" && (
                <InventorySection form={form} />
              )}

              {currentWizardStep.id === "organization" && (
                <OrganizationSection
                  form={form}
                  categories={categories}
                  subcategories={subcategories}
                  brands={brands}
                  collections={collections}
                  tags={tags}
                />
              )}

              {currentWizardStep.id === "images" && (
                <ImagesSection
                  images={images}
                  setImages={setImages}
                  uploaderRef={mediaUploaderRef}
                />
              )}

              {currentWizardStep.id === "seo" && (
                <SeoSection form={form} />
              )}

              {currentWizardStep.id === "status" && (
                <StatusSection form={form} />
              )}
            </div>

            {/* Step controls */}
            <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 0 || saving}
                  className="h-11 rounded-xl border-slate-200 bg-white px-5"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {!isLastStep && (
                    <Button
                      type="button"
                      onClick={goNext}
                      disabled={saving}
                      className="h-11 rounded-xl bg-slate-950 px-6 font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                      Save & Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {isLastStep && (
                    <Button
                      type="submit"
                      disabled={saving}
                      className="h-11 rounded-xl bg-slate-950 px-6 font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      {saveLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Desktop progress/sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-5 space-y-4">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Progress
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {completedStepCount}/{baseSteps.length}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    {wizardCompletionPercent}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{
                      width: `${wizardCompletionPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-2">
                {baseSteps.map((step, index) => {
                  const Icon = step.icon;
                  const completed = isStepComplete(step.id);
                  const active = index === currentStep;
                  const clickable =
                    index <= currentStep ||
                    index < completedStepCount;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      disabled={!clickable}
                      onClick={() => goToStep(index)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        active
                          ? "bg-slate-950 text-white"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          active
                            ? "bg-white/10 text-white"
                            : completed
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {completed && !active ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-xs font-semibold ${
                            active ? "text-white" : "text-slate-700"
                          }`}
                        >
                          {index + 1}. {step.label}
                        </span>
                        <span
                          className={`mt-0.5 block text-[10px] ${
                            active
                              ? "text-white/50"
                              : completed
                                ? "text-emerald-600"
                                : "text-slate-400"
                          }`}
                        >
                          {active
                            ? "Current section"
                            : completed
                              ? "Complete"
                              : "Not completed"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Live snapshot */}
            <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 text-white/50">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                    Live snapshot
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-2 text-sm font-semibold">
                  {watchedName || "Your product name"}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-[10px] text-white/40">Price</p>
                    <p className="mt-1 text-sm font-semibold">
                      {watchedPrice > 0
                        ? `₹${watchedPrice.toLocaleString()}`
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-[10px] text-white/40">Stock</p>
                    <p className="mt-1 text-sm font-semibold">
                      {watchedStock}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl bg-white/10 p-3">
                    <p className="text-[10px] text-white/40">
                      Images
                    </p>
                    <p className="mt-1 text-xs font-semibold">
                      {images.length} / 10 uploaded
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_25px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 0 || saving}
            className="h-11 flex-1 rounded-xl border-slate-200 bg-white"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>

          {!isLastStep ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={saving}
              className="h-11 flex-[1.5] rounded-xl bg-slate-950 font-semibold text-white hover:bg-slate-800"
            >
              Save & Continue
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={saving}
              className="h-11 flex-[1.5] rounded-xl bg-slate-950 font-semibold text-white hover:bg-slate-800"
            >
              {saving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
              )}
              {saveLabel}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
