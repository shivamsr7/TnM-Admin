import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { useProducts } from "@/features/products/hooks/useProducts";

import { useUpdateCollaboration } from "../hooks/useCollaborations";

import type {
  Collaboration,
  CollaborationProduct,
  CollaborationStatus,
  CollaborationType,
} from "../types/collaborator.types";

interface EditCollaborationModalProps {
  collaboration: Collaboration | null;
  open: boolean;
  onClose: () => void;
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

interface SelectedProduct {
  product_id: string;
  quantity: number;
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

function getPrimaryImage(product: any): string | null {
  const images = Array.isArray(product?.product_images)
    ? product.product_images
    : [];

  const primary = images.find(
    (image: any) => image?.is_primary
  );

  return (
    primary?.image_url ??
    images
      .slice()
      .sort(
        (a: any, b: any) =>
          (a?.sort_order ?? 0) -
          (b?.sort_order ?? 0)
      )[0]?.image_url ??
    null
  );
}

function getProductName(product: any) {
  return product?.name ?? "Unnamed Product";
}

function getProductSku(product: any) {
  return product?.sku ?? null;
}

export default function EditCollaborationModal({
  collaboration,
  open,
  onClose,
}: EditCollaborationModalProps) {
  const updateCollaboration =
    useUpdateCollaboration();

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useProducts();

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [selectedProducts, setSelectedProducts] =
    useState<SelectedProduct[]>([]);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open || !collaboration) {
      return;
    }

    setForm({
      campaign_name:
        collaboration.campaign_name ?? "",

      collaboration_type:
        collaboration.collaboration_type,

      status:
        collaboration.status,

      start_date:
        collaboration.start_date
          ? collaboration.start_date.slice(0, 10)
          : "",

      end_date:
        collaboration.end_date
          ? collaboration.end_date.slice(0, 10)
          : "",

      deliverables_expected:
        String(
          collaboration.deliverables_expected ?? 0
        ),

      notes:
        collaboration.notes ?? "",
    });

    setSelectedProducts(
      Array.isArray(collaboration.products)
        ? collaboration.products.map(
            (product) => ({
              product_id:
                product.product_id,
              quantity:
                product.quantity > 0
                  ? product.quantity
                  : 1,
            })
          )
        : []
    );

    setSearch("");
    setError(null);
  }, [open, collaboration]);

  const selectedIds = useMemo(
    () =>
      new Set(
        selectedProducts.map(
          (product) =>
            product.product_id
        )
      ),
    [selectedProducts]
  );

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(
      (product: any) => {
        const name = String(
          product?.name ?? ""
        ).toLowerCase();

        const sku = String(
          product?.sku ?? ""
        ).toLowerCase();

        return (
          name.includes(query) ||
          sku.includes(query)
        );
      }
    );
  }, [products, search]);

  const selectedProductDetails =
    useMemo(() => {
      return selectedProducts
        .map((selected) => {
          const product = products.find(
            (item: any) =>
              item?.id ===
              selected.product_id
          );

          return {
            selected,
            product,
          };
        })
        .filter(
          (item) => Boolean(item.product)
        );
    }, [products, selectedProducts]);

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

  const toggleProduct = (
    productId: string
  ) => {
    setSelectedProducts((current) => {
      const exists = current.some(
        (product) =>
          product.product_id === productId
      );

      if (exists) {
        return current.filter(
          (product) =>
            product.product_id !== productId
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

    if (error) {
      setError(null);
    }
  };

  const updateQuantity = (
    productId: string,
    value: string
  ) => {
    const quantity = Number(value);

    if (
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {
      return;
    }

    setSelectedProducts((current) =>
      current.map((product) =>
        product.product_id === productId
          ? {
              ...product,
              quantity: Math.floor(
                quantity
              ),
            }
          : product
      )
    );
  };

  const removeProduct = (
    productId: string
  ) => {
    setSelectedProducts((current) =>
      current.filter(
        (product) =>
          product.product_id !== productId
      )
    );
  };

  const handleClose = () => {
    if (updateCollaboration.isPending) {
      return;
    }

    onClose();
  };

  const handleSubmit = async () => {
    if (!collaboration) {
      return;
    }

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

    const productsPayload: CollaborationProduct[] =
      selectedProducts.map(
        (product) => ({
          product_id:
            product.product_id,
          quantity:
            product.quantity,
        })
      );

    try {
      await updateCollaboration.mutateAsync({
        id: collaboration.id,

        updates: {
          campaign_name:
            campaignName,

          collaboration_type:
            form.collaboration_type,

          status:
            form.status,

          start_date:
            form.start_date || null,

          end_date:
            form.end_date || null,

          products:
            productsPayload,

          deliverables_expected:
            deliverables,

          notes:
            form.notes.trim() || null,
        },
      });

      onClose();
    } catch (err) {
      console.error(
        "Failed to update collaboration:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update collaboration."
      );
    }
  };

  if (!open || !collaboration) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[10002]
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
          max-h-[92vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
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
          <div className="min-w-0">
            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.16em]
                text-neutral-500
              "
            >
              Edit Collaboration
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-semibold
                text-neutral-900
              "
            >
              Update Campaign
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Modify campaign details, products and
              deliverables.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={
              updateCollaboration.isPending
            }
            className="
              flex
              h-9
              w-9
              shrink-0
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

            {/* CAMPAIGN */}

            <section
              className="
                rounded-xl
                border
                border-neutral-200
                p-5
              "
            >
              <h3 className="text-sm font-semibold">
                Campaign Details
              </h3>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="edit-campaign-name"
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
                    id="edit-campaign-name"
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
                    disabled={
                      updateCollaboration.isPending
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
                      disabled:bg-neutral-100
                    "
                  />
                </div>

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
                      htmlFor="edit-collaboration-type"
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
                      id="edit-collaboration-type"
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
                        updateCollaboration.isPending
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
                      htmlFor="edit-collaboration-status"
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-neutral-800
                      "
                    >
                      Status
                    </label>

                    <select
                      id="edit-collaboration-status"
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target
                            .value as CollaborationStatus
                        )
                      }
                      disabled={
                        updateCollaboration.isPending
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
                      <option value="completed">
                        Completed
                      </option>
                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>

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
                      htmlFor="edit-start-date"
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
                      <CalendarDays size={15} />
                      Start Date
                    </label>

                    <input
                      id="edit-start-date"
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
                        updateCollaboration.isPending
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
                      htmlFor="edit-end-date"
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
                      <CalendarDays size={15} />
                      End Date
                    </label>

                    <input
                      id="edit-end-date"
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
                        updateCollaboration.isPending
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
              </div>
            </section>

            {/* PRODUCTS */}

            <section
              className="
                rounded-xl
                border
                border-neutral-200
                p-5
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Products
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    Select the products included in this
                    collaboration.
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-neutral-100
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-neutral-600
                  "
                >
                  {selectedProducts.length} selected
                </span>
              </div>

              <div className="relative mt-4">
                <Search
                  size={16}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-neutral-400
                  "
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search products by name or SKU..."
                  disabled={
                    updateCollaboration.isPending
                  }
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
                    focus:border-neutral-400
                    focus:ring-2
                    focus:ring-neutral-200
                  "
                />
              </div>

              {isLoadingProducts && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    px-4
                    py-6
                    text-center
                    text-sm
                    text-neutral-500
                  "
                >
                  Loading products...
                </div>
              )}

              {isProductsError && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-4
                    text-sm
                    text-red-700
                  "
                >
                  Unable to load products.
                </div>
              )}

              {!isLoadingProducts &&
                !isProductsError && (
                  <div
                    className="
                      mt-4
                      max-h-64
                      overflow-y-auto
                      rounded-xl
                      border
                      border-neutral-200
                    "
                  >
                    {filteredProducts.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-neutral-500">
                        No products found.
                      </div>
                    ) : (
                      filteredProducts.map(
                        (product: any) => {
                          const selected =
                            selectedIds.has(
                              product.id
                            );

                          const image =
                            getPrimaryImage(
                              product
                            );

                          return (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() =>
                                toggleProduct(
                                  product.id
                                )
                              }
                              disabled={
                                updateCollaboration.isPending
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                border-b
                                border-neutral-100
                                px-3
                                py-3
                                text-left
                                transition
                                last:border-b-0
                                hover:bg-neutral-50
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                              "
                            >
                              <div
                                className="
                                  flex
                                  h-12
                                  w-12
                                  shrink-0
                                  items-center
                                  justify-center
                                  overflow-hidden
                                  rounded-lg
                                  border
                                  border-neutral-200
                                  bg-neutral-50
                                "
                              >
                                {image ? (
                                  <img
                                    src={image}
                                    alt={getProductName(
                                      product
                                    )}
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                    "
                                  />
                                ) : (
                                  <span className="text-[10px] text-neutral-400">
                                    No image
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-neutral-900">
                                  {getProductName(
                                    product
                                  )}
                                </p>

                                {getProductSku(
                                  product
                                ) && (
                                  <p className="mt-0.5 text-xs text-neutral-500">
                                    SKU:{" "}
                                    {getProductSku(
                                      product
                                    )}
                                  </p>
                                )}
                              </div>

                              <span
                                className={`
                                  flex
                                  h-6
                                  w-6
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
                                <Check size={14} />
                              </span>
                            </button>
                          );
                        }
                      )
                    )}
                  </div>
                )}

              {/* SELECTED PRODUCTS */}

              {selectedProducts.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-xs font-medium text-neutral-600">
                    Selected Products
                  </p>

                  <div className="space-y-2">
                    {selectedProductDetails.map(
                      ({
                        selected,
                        product,
                      }) => {
                        const image =
                          getPrimaryImage(
                            product
                          );

                        return (
                          <div
                            key={
                              selected.product_id
                            }
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              border
                              border-neutral-200
                              p-3
                            "
                          >
                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-neutral-200
                                bg-neutral-50
                              "
                            >
                              {image ? (
                                <img
                                  src={image}
                                  alt={getProductName(
                                    product
                                  )}
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                                />
                              ) : (
                                <span className="text-[9px] text-neutral-400">
                                  No image
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {getProductName(
                                  product
                                )}
                              </p>

                              {getProductSku(
                                product
                              ) && (
                                <p className="mt-0.5 text-xs text-neutral-500">
                                  SKU:{" "}
                                  {getProductSku(
                                    product
                                  )}
                                </p>
                              )}
                            </div>

                            <input
                              type="number"
                              min="1"
                              value={
                                selected.quantity
                              }
                              onChange={(event) =>
                                updateQuantity(
                                  selected.product_id,
                                  event.target.value
                                )
                              }
                              disabled={
                                updateCollaboration.isPending
                              }
                              aria-label={`Quantity for ${getProductName(
                                product
                              )}`}
                              className="
                                h-9
                                w-20
                                rounded-lg
                                border
                                border-neutral-200
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
                                removeProduct(
                                  selected.product_id
                                )
                              }
                              disabled={
                                updateCollaboration.isPending
                              }
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-neutral-400
                                transition
                                hover:bg-red-50
                                hover:text-red-600
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              aria-label={`Remove ${getProductName(
                                product
                              )}`}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* DELIVERABLES */}

            <section
              className="
                rounded-xl
                border
                border-neutral-200
                p-5
              "
            >
              <h3 className="text-sm font-semibold">
                Deliverables & Notes
              </h3>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="edit-deliverables"
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
                    id="edit-deliverables"
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
                      updateCollaboration.isPending
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
                    htmlFor="edit-collaboration-notes"
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
                    id="edit-collaboration-notes"
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
                      updateCollaboration.isPending
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
            </section>
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
              updateCollaboration.isPending
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
              updateCollaboration.isPending
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
            {updateCollaboration.isPending ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
