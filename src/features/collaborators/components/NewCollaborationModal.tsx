import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { useCreateCollaboration } from "../hooks/useCollaborations";
import { useProducts } from "@/features/products/hooks/useProducts";

import type {
  CollaboratorProfile,
  CollaborationStatus,
  CollaborationType,
} from "../types/collaborator.types";

interface NewCollaborationModalProps {
  creator: CollaboratorProfile | null;
  open: boolean;
  onClose: () => void;
}

interface SelectedProduct {
  product_id: string;
  quantity: number;
}

interface FormState {
  campaign_name: string;
  collaboration_type: CollaborationType;
  status: CollaborationStatus;
  start_date: string;
  end_date: string;
  deliverables_expected: string;
  notes: string;
}

const initialForm: FormState = {
  campaign_name: "",
  collaboration_type: "gifted",
  status: "planned",
  start_date: "",
  end_date: "",
  deliverables_expected: "1",
  notes: "",
};

export default function NewCollaborationModal({
  creator,
  open,
  onClose,
}: NewCollaborationModalProps) {
  const createCollaboration =
    useCreateCollaboration();

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [error, setError] =
    useState<string | null>(null);

  const [productSearch, setProductSearch] =
    useState("");

  const [selectedProducts, setSelectedProducts] =
    useState<SelectedProduct[]>([]);

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError,
  } = useProducts();

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setError(null);
      setProductSearch("");
      setSelectedProducts([]);
    }
  }, [open]);

  if (!open || !creator) {
    return null;
  }

  const updateField = <
    K extends keyof FormState
  >(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  const getProductName = (product: any) =>
    product?.name ??
    product?.title ??
    "Unnamed Product";

  const getProductPrice = (product: any) => {
    const value =
      product?.sale_price ??
      product?.selling_price ??
      product?.price ??
      product?.discounted_price;

    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue)
      ? numericValue
      : null;
  };

  const getProductImage = (product: any) => {
    const images = Array.isArray(product?.product_images)
      ? product.product_images
      : [];

    const primary =
      images.find((image: any) => image?.is_primary) ??
      images.sort(
        (a: any, b: any) =>
          Number(a?.sort_order ?? 0) -
          Number(b?.sort_order ?? 0)
      )[0];

    return primary?.image_url ?? null;
  };

  const filteredProducts = products.filter((product: any) => {
    const query = productSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const name = String(getProductName(product)).toLowerCase();
    const sku = String(product?.sku ?? "").toLowerCase();

    return (
      name.includes(query) ||
      sku.includes(query)
    );
  });

  const isProductSelected = (productId: string) =>
    selectedProducts.some(
      (product) => product.product_id === productId
    );

  const toggleProduct = (productId: string) => {
    setSelectedProducts((current) => {
      const exists = current.some(
        (product) => product.product_id === productId
      );

      if (exists) {
        return current.filter(
          (product) => product.product_id !== productId
        );
      }

      return [
        ...current,
        {
          product_id: productId,
          quantity: 1,
        },
      ];
    });
  };

  const updateProductQuantity = (
    productId: string,
    quantity: number
  ) => {
    const safeQuantity = Math.max(
      1,
      Number.isFinite(quantity) ? Math.floor(quantity) : 1
    );

    setSelectedProducts((current) =>
      current.map((product) =>
        product.product_id === productId
          ? {
              ...product,
              quantity: safeQuantity,
            }
          : product
      )
    );
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((current) =>
      current.filter(
        (product) => product.product_id !== productId
      )
    );
  };

  const handleClose = () => {
    if (createCollaboration.isPending) {
      return;
    }

    onClose();
  };

  const handleSubmit = async () => {
    const campaignName =
      form.campaign_name.trim();

    if (!campaignName) {
      setError(
        "Campaign name is required."
      );
      return;
    }

    const deliverables =
      Number(
        form.deliverables_expected
      );

    if (
      !Number.isFinite(deliverables) ||
      deliverables < 0
    ) {
      setError(
        "Expected deliverables must be a valid non-negative number."
      );
      return;
    }

    if (
      form.start_date &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      setError(
        "End date cannot be before the start date."
      );
      return;
    }

    try {
      await createCollaboration.mutateAsync({
        collaborator_id: creator.id,

        campaign_name: campaignName,

        collaboration_type:
          form.collaboration_type,

        status: form.status,

        start_date:
          form.start_date || null,

        end_date:
          form.end_date || null,

        products: selectedProducts,

        deliverables_expected:
          deliverables,

        notes:
          form.notes.trim() || null,
      });

      onClose();
    } catch (err) {
      console.error(
        "Failed to create collaboration:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create collaboration."
      );
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[10001]
        flex
        items-center
        justify-center
        bg-black/60
        p-4
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* HEADER */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            border-b
            px-6
            py-5
          "
        >
          <div>
            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.16em]
                text-neutral-500
              "
            >
              New Collaboration
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-semibold
                text-neutral-900
              "
            >
              Create Campaign
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-neutral-500
              "
            >
              For {creator.full_name} · @
              {creator.instagram_username}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={
              createCollaboration.isPending
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-neutral-200
              text-neutral-500
              transition
              hover:bg-neutral-100
              hover:text-neutral-900
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-6
          "
        >
          <div className="space-y-5">

            {/* ERROR */}

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* CAMPAIGN NAME */}

            <div>
              <label
                htmlFor="campaign-name"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-800
                "
              >
                Campaign Name
              </label>

              <input
                id="campaign-name"
                type="text"
                value={
                  form.campaign_name
                }
                onChange={(event) =>
                  updateField(
                    "campaign_name",
                    event.target.value
                  )
                }
                placeholder="e.g. Festive Jewelry Campaign"
                disabled={
                  createCollaboration.isPending
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-neutral-200
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-neutral-400
                  focus:border-neutral-400
                  focus:ring-2
                  focus:ring-neutral-200
                  disabled:bg-neutral-100
                "
              />
            </div>

            {/* TYPE + STATUS */}

            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
              "
            >
              <div>
                <label
                  htmlFor="collaboration-type"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-neutral-800
                  "
                >
                  Collaboration Type
                </label>

                <select
                  id="collaboration-type"
                  value={
                    form.collaboration_type
                  }
                  onChange={(event) =>
                    updateField(
                      "collaboration_type",
                      event.target
                        .value as CollaborationType
                    )
                  }
                  disabled={
                    createCollaboration.isPending
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-3
                    text-sm
                    capitalize
                    outline-none
                    transition
                    focus:border-neutral-400
                    focus:ring-2
                    focus:ring-neutral-200
                  "
                >
                  <option value="gifted">
                    Gifted
                  </option>

                  <option value="affiliate">
                    Affiliate
                  </option>

                  <option value="paid">
                    Paid
                  </option>

                  <option value="ugc">
                    UGC
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="collaboration-status"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-neutral-800
                  "
                >
                  Initial Status
                </label>

                <select
                  id="collaboration-status"
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target
                        .value as CollaborationStatus
                    )
                  }
                  disabled={
                    createCollaboration.isPending
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-3
                    text-sm
                    capitalize
                    outline-none
                    transition
                    focus:border-neutral-400
                    focus:ring-2
                    focus:ring-neutral-200
                  "
                >
                  <option value="planned">
                    Planned
                  </option>

                  <option value="active">
                    Active
                  </option>
                </select>
              </div>
            </div>

            {/* DATES */}

            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
              "
            >
              <div>
                <label
                  htmlFor="start-date"
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-neutral-800
                  "
                >
                  <CalendarDays
                    size={15}
                  />
                  Start Date
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={
                    form.start_date
                  }
                  onChange={(event) =>
                    updateField(
                      "start_date",
                      event.target.value
                    )
                  }
                  disabled={
                    createCollaboration.isPending
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-3
                    text-sm
                    outline-none
                    transition
                    focus:border-neutral-400
                    focus:ring-2
                    focus:ring-neutral-200
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="end-date"
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-neutral-800
                  "
                >
                  <CalendarDays
                    size={15}
                  />
                  End Date
                </label>

                <input
                  id="end-date"
                  type="date"
                  value={
                    form.end_date
                  }
                  onChange={(event) =>
                    updateField(
                      "end_date",
                      event.target.value
                    )
                  }
                  disabled={
                    createCollaboration.isPending
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-3
                    text-sm
                    outline-none
                    transition
                    focus:border-neutral-400
                    focus:ring-2
                    focus:ring-neutral-200
                  "
                />
              </div>
            </div>

            {/* DELIVERABLES */}

            <div>
              <label
                htmlFor="deliverables"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-800
                "
              >
                Expected Deliverables
              </label>

              <input
                id="deliverables"
                type="number"
                min="0"
                value={
                  form.deliverables_expected
                }
                onChange={(event) =>
                  updateField(
                    "deliverables_expected",
                    event.target.value
                  )
                }
                disabled={
                  createCollaboration.isPending
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-neutral-200
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-neutral-400
                  focus:ring-2
                  focus:ring-neutral-200
                "
              />
            </div>

            {/* PRODUCTS */}

            <div
              className="
                rounded-2xl
                border
                border-neutral-200
                bg-neutral-50
                p-4
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Products for Collaboration
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    Select the products you plan to send or feature in this campaign.
                  </p>
                </div>

                {selectedProducts.length > 0 && (
                  <span className="shrink-0 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white">
                    {selectedProducts.length} selected
                  </span>
                )}
              </div>

              {/* SEARCH */}

              <div className="relative mt-4">
                <Search
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-neutral-400
                  "
                />

                <input
                  type="text"
                  value={productSearch}
                  onChange={(event) =>
                    setProductSearch(event.target.value)
                  }
                  placeholder="Search products by name or SKU..."
                  disabled={createCollaboration.isPending}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    pl-10
                    pr-3
                    text-sm
                    outline-none
                    transition
                    placeholder:text-neutral-400
                    focus:border-neutral-400
                    focus:ring-2
                    focus:ring-neutral-200
                    disabled:bg-neutral-100
                  "
                />
              </div>

              {/* SELECTED PRODUCTS */}

              {selectedProducts.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Selected Products
                  </p>

                  <div className="space-y-2">
                    {selectedProducts.map((selected) => {
                      const product = products.find(
                        (item: any) => item?.id === selected.product_id
                      );

                      if (!product) {
                        return null;
                      }

                      const image = getProductImage(product);

                      return (
                        <div
                          key={selected.product_id}
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-neutral-200
                            bg-white
                            p-3
                          "
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                            {image ? (
                              <img
                                src={image}
                                alt={getProductName(product)}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-neutral-900">
                              {getProductName(product)}
                            </p>

                            {getProductPrice(product) !== null && (
                              <p className="mt-0.5 text-xs text-neutral-500">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  getProductPrice(product) as number
                                )}
                              </p>
                            )}
                          </div>

                          <input
                            type="number"
                            min="1"
                            value={selected.quantity}
                            onChange={(event) =>
                              updateProductQuantity(
                                selected.product_id,
                                Number(event.target.value)
                              )
                            }
                            disabled={createCollaboration.isPending}
                            aria-label={`Quantity for ${getProductName(product)}`}
                            className="
                              h-9
                              w-16
                              rounded-lg
                              border
                              border-neutral-200
                              bg-white
                              px-2
                              text-center
                              text-sm
                              outline-none
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(selected.product_id)
                            }
                            disabled={createCollaboration.isPending}
                            aria-label={`Remove ${getProductName(product)}`}
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-neutral-200
                              text-neutral-500
                              transition
                              hover:bg-neutral-100
                              hover:text-neutral-900
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            <X size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PRODUCT LIST */}

              <div className="mt-4">
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-8">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Loading products...
                    </div>
                  </div>
                ) : isProductsError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {productsError instanceof Error
                      ? productsError.message
                      : "Unable to load products."}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="rounded-xl border border-neutral-200 bg-white px-4 py-8 text-center">
                    <p className="text-sm font-medium text-neutral-700">
                      No products found
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Try a different product name or SKU.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {filteredProducts.map((product: any) => {
                      const productId = String(product?.id ?? "");
                      const selected = isProductSelected(productId);
                      const image = getProductImage(product);

                      return (
                        <button
                          key={productId}
                          type="button"
                          onClick={() => toggleProduct(productId)}
                          disabled={
                            createCollaboration.isPending ||
                            !productId
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            border
                            p-3
                            text-left
                            transition
                            ${
                              selected
                                ? "border-neutral-900 bg-neutral-100"
                                : "border-neutral-200 bg-white hover:bg-neutral-50"
                            }
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          `}
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                            {image ? (
                              <img
                                src={image}
                                alt={getProductName(product)}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-neutral-900">
                              {getProductName(product)}
                            </p>

                            <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                              {getProductPrice(product) !== null && (
                                <span>
                                  ₹
                                  {new Intl.NumberFormat("en-IN").format(
                                    getProductPrice(product) as number
                                  )}
                                </span>
                              )}

                              {product?.sku && (
                                <span className="truncate">
                                  SKU: {product.sku}
                                </span>
                              )}
                            </div>
                          </div>

                          <span
                            className={`
                              flex
                              h-7
                              w-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              transition
                              ${
                                selected
                                  ? "border-neutral-900 bg-neutral-900 text-white"
                                  : "border-neutral-300 bg-white text-transparent"
                              }
                            `}
                          >
                            <Check size={15} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* NOTES */}

            <div>
              <label
                htmlFor="collaboration-notes"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-800
                "
              >
                Notes
              </label>

              <textarea
                id="collaboration-notes"
                rows={5}
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value
                  )
                }
                placeholder="Add campaign instructions, product details, content requirements, etc."
                disabled={
                  createCollaboration.isPending
                }
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-neutral-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-neutral-400
                  focus:border-neutral-400
                  focus:ring-2
                  focus:ring-neutral-200
                "
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            flex
            shrink-0
            flex-col-reverse
            gap-3
            border-t
            px-6
            py-4
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={
              createCollaboration.isPending
            }
            className="
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-5
              py-2.5
              text-sm
              font-medium
              text-neutral-700
              transition
              hover:bg-neutral-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              createCollaboration.isPending
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-neutral-900
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {createCollaboration.isPending ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              "Create Collaboration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}