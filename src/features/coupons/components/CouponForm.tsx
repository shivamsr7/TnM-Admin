import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

import { useCategories } from "@/features/categories/hooks/useCategories";
import { useBrands } from "@/features/brands/hooks/useBrands";
import { useCollections } from "@/features/collections/hooks/useCollections";
import { useTags } from "@/features/tags/hooks/useTags";

import {
  couponSchema,
  type CouponSchema,
} from "../schemas/coupon.schema";

import type {
  Coupon,
  CouponFormData,
  CouponTargetType,
  CouponTargetMode,
} from "../types/coupon.types";

import {
  couponService,
} from "../services/coupon.service";

interface SelectorOption {
  id: string;
  label: string;
  secondary?: string;
}

interface SearchableMultiSelectProps {
  label: string;
  placeholder: string;
  options: SelectorOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  loading?: boolean;
  emptyText?: string;
}

function SearchableMultiSelect({
  label,
  placeholder,
  options,
  selectedIds,
  onChange,
  loading = false,
  emptyText = "No options found.",
}: SearchableMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOptions = useMemo(
    () =>
      selectedIds
        .map((id) =>
          options.find(
            (option) => option.id === id
          )
        )
        .filter(Boolean) as SelectorOption[],
    [options, selectedIds]
  );

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) =>
      `${option.label} ${option.secondary ?? ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [options, search]);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(
        selectedIds.filter(
          (selectedId) => selectedId !== id
        )
      );
    } else {
      onChange([
        ...selectedIds,
        id,
      ]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpen((value) => !value)
          }
          className="
            flex w-full min-h-11
            items-center justify-between gap-2
            rounded-md border bg-background
            px-3 py-2 text-left
            text-sm
            transition
            hover:bg-muted/40
          "
        >
          <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">
                {placeholder}
              </span>
            ) : (
              selectedOptions
                .slice(0, 3)
                .map((option) => (
                  <span
                    key={option.id}
                    className="
                      inline-flex max-w-full
                      items-center gap-1
                      rounded-full
                      bg-muted
                      px-2 py-1
                      text-xs font-medium
                    "
                  >
                    <span className="max-w-[180px] truncate">
                      {option.label}
                    </span>

                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggle(option.id);
                      }}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          event.stopPropagation();
                          toggle(option.id);
                        }
                      }}
                      className="
                        rounded-full
                        text-muted-foreground
                        hover:text-foreground
                      "
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </span>
                ))
            )}

            {selectedOptions.length > 3 && (
              <span
                className="
                  rounded-full bg-muted
                  px-2 py-1
                  text-xs font-medium
                "
              >
                +{selectedOptions.length - 3} more
              </span>
            )}
          </div>

          <ChevronDown
            className={`
              h-4 w-4 shrink-0
              text-muted-foreground
              transition-transform
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-label="Close selector"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />

            <div
              className="
                absolute left-0 right-0 z-50 mt-2
                overflow-hidden
                rounded-xl border
                bg-background
                shadow-xl
              "
            >
              <div className="border-b p-2">
                <div className="flex items-center gap-2 rounded-lg border px-3">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <Input
                    autoFocus
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search..."
                    className="border-0 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto p-1">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 p-5 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="p-5 text-center text-sm text-muted-foreground">
                    {emptyText}
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const selected =
                      selectedIds.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          toggle(option.id)
                        }
                        className="
                          flex w-full items-center gap-3
                          rounded-lg px-3 py-2.5
                          text-left
                          transition
                          hover:bg-muted
                        "
                      >
                        <span
                          className={`
                            flex h-4 w-4 shrink-0
                            items-center justify-center
                            rounded border
                            ${
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/40"
                            }
                          `}
                        >
                          {selected && (
                            <Check className="h-3 w-3" />
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {option.label}
                          </span>

                          {option.secondary && (
                            <span className="block truncate text-xs text-muted-foreground">
                              {option.secondary}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {selectedOptions.length > 0 && (
                <div className="flex items-center justify-between border-t px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    {selectedOptions.length} selected
                  </span>

                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export interface CouponFormSubmitData {
  data: CouponFormData;

  targets: Array<{
    target_type: CouponTargetType;
    target_id: string;
    target_mode: CouponTargetMode;
  }>;

  customerIds: string[];

  membershipTierIds: string[];
}

interface CouponFormProps {
  initialData?: Coupon | null;
  loading?: boolean;
  onSubmit: (
    payload: CouponFormSubmitData
  ) => void | Promise<void>;
}

const nullableNumberValue = (
  value: string
) =>
  value === "" ? null : Number(value);

export default function CouponForm({
  initialData,
  loading = false,
  onSubmit,
}: CouponFormProps) {
  const isEditing = !!initialData;

  /*
   * =========================================================
   * EXISTING CATALOGUE DATA
   * =========================================================
   *
   * Reuse the same hooks already used by ProductForm for
   * categories, brands, collections and tags.
   */

  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useCategories();

  const {
    data: brands = [],
    isLoading: loadingBrands,
  } = useBrands();

  const {
    data: collections = [],
    isLoading: loadingCollections,
  } = useCollections();

  const {
    data: tags = [],
    isLoading: loadingTags,
  } = useTags();


  /*
   * =========================================================
   * PRODUCTS / CUSTOMERS / MEMBERSHIP TIERS
   * =========================================================
   */

  const [
    products,
    setProducts,
  ] = useState<SelectorOption[]>([]);

  const [
    customers,
    setCustomers,
  ] = useState<SelectorOption[]>([]);

  const [
    membershipTiers,
    setMembershipTiers,
  ] = useState<SelectorOption[]>([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(false);

  const [
    loadingCustomers,
    setLoadingCustomers,
  ] = useState(false);

  const [
    loadingMembershipTiers,
    setLoadingMembershipTiers,
  ] = useState(false);


  /*
   * Selected relationships are kept separately from the
   * coupon row. They will be persisted into the new
   * relationship tables by the parent save integration.
   */

  const [
    includedTargetIds,
    setIncludedTargetIds,
  ] = useState<string[]>([]);

  const [
    excludedTargetIds,
    setExcludedTargetIds,
  ] = useState<string[]>([]);

  const [
    selectedCustomerIds,
    setSelectedCustomerIds,
  ] = useState<string[]>([]);

  const [
    selectedMembershipTierIds,
    setSelectedMembershipTierIds,
  ] = useState<string[]>([]);


  /*
   * Load existing relationship selections when editing.
   *
   * This means Edit Coupon opens with the previously saved
   * products/customers/tiers already selected.
   */

  useEffect(() => {
    let cancelled = false;

    async function loadExistingSelections() {
      if (!initialData?.id) {
        setIncludedTargetIds([]);
        setExcludedTargetIds([]);
        setSelectedCustomerIds([]);
        setSelectedMembershipTierIds([]);
        return;
      }

      try {
        const [
          targets,
          couponCustomers,
          tiers,
        ] = await Promise.all([
          couponService.getCouponTargets(
            initialData.id
          ),
          couponService.getCouponCustomers(
            initialData.id
          ),
          couponService.getCouponMembershipTiers(
            initialData.id
          ),
        ]);

        if (cancelled) return;

        setIncludedTargetIds(
          targets
            .filter(
              (row) =>
                row.target_mode ===
                "include"
            )
            .map(
              (row) =>
                row.target_id
            )
        );

        setExcludedTargetIds(
          targets
            .filter(
              (row) =>
                row.target_mode ===
                "exclude"
            )
            .map(
              (row) =>
                row.target_id
            )
        );

        setSelectedCustomerIds(
          couponCustomers.map(
            (row) =>
              row.customer_id
          )
        );

        setSelectedMembershipTierIds(
          tiers.map(
            (row) =>
              row.tier_id
          )
        );
      } catch (error) {
        console.error(
          "Failed to load coupon targeting:",
          error
        );
      }
    }

    loadExistingSelections();

    return () => {
      cancelled = true;
    };
  }, [initialData?.id]);


  /*
   * Load products, customers and membership tiers.
   */

  useEffect(() => {
    let cancelled = false;

    async function loadAdvancedOptions() {
      setLoadingProducts(true);
      setLoadingCustomers(true);
      setLoadingMembershipTiers(true);

      try {
        const [
          productsResult,
          customersResult,
          tiersResult,
        ] = await Promise.all([
          supabase
            .from("products")
            .select("id, name, sku")
            .order("name", {
              ascending: true,
            }),

          supabase
            .from("customers")
            .select(
              "id, first_name, last_name, email, phone"
            )
            .order("created_at", {
              ascending: false,
            }),

          supabase
            .from("reward_tiers")
            .select("id, name")
            .order("min_spend", {
              ascending: true,
            }),
        ]);

        if (cancelled) return;

        if (productsResult.error) {
          console.error(
            "Failed to load products:",
            productsResult.error
          );
        } else {
          setProducts(
            (productsResult.data ?? []).map(
              (product: any) => ({
                id: product.id,
                label:
                  product.name ||
                  "Unnamed Product",
                secondary:
                  product.sku ||
                  undefined,
              })
            )
          );
        }

        if (customersResult.error) {
          console.error(
            "Failed to load customers:",
            customersResult.error
          );
        } else {
          setCustomers(
            (customersResult.data ?? []).map(
              (customer: any) => {
                const name =
                  [
                    customer.first_name,
                    customer.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ") ||
                  "Customer";

                return {
                  id: customer.id,
                  label: name,
                  secondary:
                    customer.phone ||
                    customer.email ||
                    undefined,
                };
              }
            )
          );
        }

        if (tiersResult.error) {
          console.error(
            "Failed to load membership tiers:",
            tiersResult.error
          );
        } else {
          setMembershipTiers(
            (tiersResult.data ?? []).map(
              (tier: any) => ({
                id: tier.id,
                label:
                  tier.name ||
                  "Membership Tier",
              })
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
          setLoadingCustomers(false);
          setLoadingMembershipTiers(false);
        }
      }
    }

    loadAdvancedOptions();

    return () => {
      cancelled = true;
    };
  }, []);


  const form =

    useForm<CouponSchema>({
      resolver:
        zodResolver(couponSchema),

      defaultValues: {
        code: "",
        title: "",
        description: "",

        discount_type:
          "percentage",

        discount_value: 0,

        minimum_order_amount:
          0,

        maximum_discount:
          null,

        usage_limit:
          null,

        one_use_per_customer:
          false,

        starts_at:
          null,

        expires_at:
          null,

        is_active:
          true,

        spin_enabled:
          false,

        spin_probability:
          0,

        reward_display_name:
          "",

        show_in_cart:
          false,

        cart_display_text:
          "",

        cart_display_priority:
          0,

        apply_scope:
          "all",

        customer_scope:
          "all",

        condition_logic:
          "all",

        stacking_mode:
          "exclusive",

        auto_apply:
          false,

        min_cart_quantity:
          null,

        max_cart_quantity:
          null,

        min_eligible_quantity:
          null,

        max_eligible_quantity:
          null,

        min_eligible_subtotal:
          null,

        max_eligible_subtotal:
          null,

        min_previous_orders:
          null,

        max_previous_orders:
          null,

        min_lifetime_spend:
          null,

        max_lifetime_spend:
          null,

        first_order_only:
          false,

        new_customer_only:
          false,

        existing_customer_only:
          false,

        offer_type:
          "standard",

        buy_quantity:
          null,

        get_quantity:
          null,

        get_discount_type:
          null,

        get_discount_value:
          null,
      },
    });

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      code:
        initialData.code,

      title:
        initialData.title,

      description:
        initialData.description ??
        "",

      discount_type:
        initialData.discount_type,

      discount_value:
        initialData.discount_value,

      minimum_order_amount:
        initialData.minimum_order_amount,

      maximum_discount:
        initialData.maximum_discount,

      usage_limit:
        initialData.usage_limit,

      one_use_per_customer:
        initialData.one_use_per_customer,

      starts_at:
        initialData.starts_at
          ? initialData.starts_at.slice(
              0,
              16
            )
          : null,

      expires_at:
        initialData.expires_at
          ? initialData.expires_at.slice(
              0,
              16
            )
          : null,

      is_active:
        initialData.is_active,

      spin_enabled:
        initialData.spin_enabled,

      spin_probability:
        initialData.spin_probability,

      reward_display_name:
        initialData.reward_display_name ??
        "",

      show_in_cart:
        initialData.show_in_cart,

      cart_display_text:
        initialData.cart_display_text ??
        "",

      cart_display_priority:
        initialData.cart_display_priority,

      apply_scope:
        initialData.apply_scope ??
        "all",

      customer_scope:
        initialData.customer_scope ??
        "all",

      condition_logic:
        initialData.condition_logic ??
        "all",

      stacking_mode:
        initialData.stacking_mode ??
        "exclusive",

      auto_apply:
        initialData.auto_apply ??
        false,

      min_cart_quantity:
        initialData.min_cart_quantity ??
        null,

      max_cart_quantity:
        initialData.max_cart_quantity ??
        null,

      min_eligible_quantity:
        initialData.min_eligible_quantity ??
        null,

      max_eligible_quantity:
        initialData.max_eligible_quantity ??
        null,

      min_eligible_subtotal:
        initialData.min_eligible_subtotal ??
        null,

      max_eligible_subtotal:
        initialData.max_eligible_subtotal ??
        null,

      min_previous_orders:
        initialData.min_previous_orders ??
        null,

      max_previous_orders:
        initialData.max_previous_orders ??
        null,

      min_lifetime_spend:
        initialData.min_lifetime_spend ??
        null,

      max_lifetime_spend:
        initialData.max_lifetime_spend ??
        null,

      first_order_only:
        initialData.first_order_only ??
        false,

      new_customer_only:
        initialData.new_customer_only ??
        false,

      existing_customer_only:
        initialData.existing_customer_only ??
        false,

      offer_type:
        initialData.offer_type ??
        "standard",

      buy_quantity:
        initialData.buy_quantity ??
        null,

      get_quantity:
        initialData.get_quantity ??
        null,

      get_discount_type:
        initialData.get_discount_type ??
        null,

      get_discount_value:
        initialData.get_discount_value ??
        null,
    });
  }, [
    initialData,
    form,
  ]);

  const spinEnabled =
    form.watch("spin_enabled");

  const discountType =
    form.watch("discount_type");

  const showInCart =
    form.watch("show_in_cart");

  const cartDisplayText =
    form.watch("cart_display_text");

  const couponCode =
    form.watch("code");

  const applyScope =
    form.watch("apply_scope");

  const customerScope =
    form.watch("customer_scope");

  const offerType =
    form.watch("offer_type");

  const newCustomerOnly =
    form.watch(
      "new_customer_only"
    );

  const existingCustomerOnly =
    form.watch(
      "existing_customer_only"
    );

  useEffect(() => {
    if (
      discountType ===
        "free_shipping" ||
      discountType ===
        "free_gift"
    ) {
      form.setValue(
        "discount_value",
        0
      );
    }
  }, [
    discountType,
    form,
  ]);

  useEffect(() => {
    if (!spinEnabled) return;

    const current =
      form.getValues(
        "reward_display_name"
      );

    if (current?.trim()) return;

    const value =
      form.getValues(
        "discount_value"
      );

    switch (discountType) {
      case "percentage":
        form.setValue(
          "reward_display_name",
          `${value}% OFF`
        );
        break;

      case "fixed":
        form.setValue(
          "reward_display_name",
          `₹${value} OFF`
        );
        break;

      case "free_shipping":
        form.setValue(
          "reward_display_name",
          "Free Shipping"
        );
        break;

      case "free_gift":
        form.setValue(
          "reward_display_name",
          "Free Gift"
        );
        break;
    }
  }, [
    spinEnabled,
    discountType,
    form.watch("discount_value"),
    form,
  ]);

  const handleSubmit = (
    values: CouponSchema
  ) => {
    const targetType =
      values.apply_scope === "products"
        ? "product"
        : values.apply_scope === "categories"
        ? "category"
        : values.apply_scope === "collections"
        ? "collection"
        : values.apply_scope === "brands"
        ? "brand"
        : values.apply_scope === "tags"
        ? "tag"
        : null;

    const targets =
      targetType
        ? [
            ...includedTargetIds.map(
              (targetId) => ({
                target_type:
                  targetType as CouponTargetType,
                target_id: targetId,
                target_mode:
                  "include" as CouponTargetMode,
              })
            ),
            ...excludedTargetIds.map(
              (targetId) => ({
                target_type:
                  targetType as CouponTargetType,
                target_id: targetId,
                target_mode:
                  "exclude" as CouponTargetMode,
              })
            ),
          ]
        : [];

    onSubmit({
      data:
        values as CouponFormData,
      targets,
      customerIds:
        customerScope === "selected"
          ? selectedCustomerIds
          : [],
      membershipTierIds:
        selectedMembershipTierIds,
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(
        handleSubmit
      )}
      className="space-y-5"
    >

      {/* =====================================================
          BASIC INFORMATION
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <Label>
            Coupon Code
          </Label>

          <Input
            {...form.register("code")}
            placeholder="WELCOME10"
            className="uppercase"
          />

          {form.formState.errors.code && (
            <p className="mt-1 text-xs text-red-500">
              {
                form.formState.errors.code
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <Label>
            Title
          </Label>

          <Input
            {...form.register("title")}
            placeholder="Welcome Offer"
          />
        </div>

      </div>

      <div>
        <Label>
          Description
        </Label>

        <Textarea
          rows={3}
          {...form.register(
            "description"
          )}
        />
      </div>


      {/* =====================================================
          DISCOUNT
      ====================================================== */}

      <div className="rounded-xl border bg-muted/30 p-4 sm:p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            💰 Discount
          </h3>

          <p className="text-sm text-muted-foreground">
            Configure the discount customers receive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <Label>
              Discount Type
            </Label>

            <select
              className="w-full rounded-md border px-3 py-2"
              {...form.register(
                "discount_type"
              )}
            >
              <option value="percentage">
                Percentage
              </option>

              <option value="fixed">
                Fixed Amount
              </option>

              <option value="free_shipping">
                Free Shipping
              </option>

              <option value="free_gift">
                Free Gift
              </option>
            </select>
          </div>

          <div>
            <Label>
              Discount Value
            </Label>

            <Input
              type="number"
              min={0}
              disabled={
                discountType ===
                  "free_shipping" ||
                discountType ===
                  "free_gift"
              }
              {...form.register(
                "discount_value",
                {
                  valueAsNumber:
                    true,
                }
              )}
            />
          </div>

        </div>

        <div>
          <Label>
            Maximum Discount
          </Label>

          <Input
            type="number"
            min={0}
            placeholder="Leave blank for no cap"
            {...form.register(
              "maximum_discount",
              {
                setValueAs:
                  nullableNumberValue,
              }
            )}
          />
        </div>

      </div>


      {/* =====================================================
          APPLY TO
      ====================================================== */}

      <div className="rounded-xl border bg-muted/30 p-4 sm:p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            🎯 Apply Discount To
          </h3>

          <p className="text-sm text-muted-foreground">
            Choose where this coupon can be used.
          </p>
        </div>

        <div>
          <Label>
            Apply To
          </Label>

          <select
            className="w-full rounded-md border px-3 py-2"
            {...form.register(
              "apply_scope"
            )}
          >
            <option value="all">
              Entire Store
            </option>

            <option value="products">
              Selected Products
            </option>

            <option value="categories">
              Selected Categories
            </option>

            <option value="collections">
              Selected Collections
            </option>

            <option value="brands">
              Selected Brands
            </option>

            <option value="tags">
              Selected Tags
            </option>
          </select>
        </div>

        {applyScope !== "all" && (
          <div className="space-y-4 rounded-lg border bg-background p-4">

            <SearchableMultiSelect
              label={`Include ${applyScope}`}
              placeholder={`Select ${applyScope}...`}
              options={
                applyScope === "products"
                  ? products
                  : applyScope === "categories"
                  ? categories.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Category",
                    }))
                  : applyScope === "collections"
                  ? collections.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Collection",
                    }))
                  : applyScope === "brands"
                  ? brands.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Brand",
                    }))
                  : tags.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Tag",
                    }))
              }
              selectedIds={
                includedTargetIds
              }
              onChange={
                setIncludedTargetIds
              }
              loading={
                applyScope === "products"
                  ? loadingProducts
                  : applyScope === "categories"
                  ? loadingCategories
                  : applyScope === "collections"
                  ? loadingCollections
                  : applyScope === "brands"
                  ? loadingBrands
                  : loadingTags
              }
              emptyText={`No ${applyScope} found.`}
            />

            <SearchableMultiSelect
              label={`Exclude ${applyScope}`}
              placeholder={`Select ${applyScope} to exclude...`}
              options={
                applyScope === "products"
                  ? products
                  : applyScope === "categories"
                  ? categories.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Category",
                    }))
                  : applyScope === "collections"
                  ? collections.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Collection",
                    }))
                  : applyScope === "brands"
                  ? brands.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Brand",
                    }))
                  : tags.map((item: any) => ({
                      id: item.id,
                      label:
                        item.name ||
                        "Unnamed Tag",
                    }))
              }
              selectedIds={
                excludedTargetIds
              }
              onChange={
                setExcludedTargetIds
              }
              loading={
                applyScope === "products"
                  ? loadingProducts
                  : applyScope === "categories"
                  ? loadingCategories
                  : applyScope === "collections"
                  ? loadingCollections
                  : applyScope === "brands"
                  ? loadingBrands
                  : loadingTags
              }
              emptyText={`No ${applyScope} found.`}
            />

          </div>
        )}

      </div>


      {/* =====================================================
          CUSTOMER ELIGIBILITY
      ====================================================== */}

      <div className="rounded-xl border bg-muted/30 p-4 sm:p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            👤 Customer Eligibility
          </h3>

          <p className="text-sm text-muted-foreground">
            Decide which customers can use this coupon.
          </p>
        </div>

        <div>
          <Label>
            Customer Eligibility
          </Label>

          <select
            className="w-full rounded-md border px-3 py-2"
            {...form.register(
              "customer_scope"
            )}
          >
            <option value="all">
              Everyone
            </option>

            <option value="new">
              New Customers
            </option>

            <option value="existing">
              Existing Customers
            </option>

            <option value="selected">
              Selected Customers
            </option>
          </select>
        </div>

        {customerScope === "selected" && (
          <div className="rounded-lg border bg-background p-4">

            <SearchableMultiSelect
              label="Selected Customers"
              placeholder="Search and select customers..."
              options={customers}
              selectedIds={
                selectedCustomerIds
              }
              onChange={
                setSelectedCustomerIds
              }
              loading={
                loadingCustomers
              }
              emptyText="No customers found."
            />

          </div>
        )}

        <div className="rounded-lg border bg-background p-4">

          <SearchableMultiSelect
            label="Membership Tiers"
            placeholder="Select membership tiers..."
            options={membershipTiers}
            selectedIds={
              selectedMembershipTierIds
            }
            onChange={
              setSelectedMembershipTierIds
            }
            loading={
              loadingMembershipTiers
            }
            emptyText="No membership tiers found."
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Leave empty if the coupon should not be restricted by membership tier.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <Label>
              Minimum Previous Orders
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No minimum"
              {...form.register(
                "min_previous_orders",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

          <div>
            <Label>
              Maximum Previous Orders
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No maximum"
              {...form.register(
                "max_previous_orders",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <Label>
              Minimum Lifetime Spend
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="₹0"
              {...form.register(
                "min_lifetime_spend",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

          <div>
            <Label>
              Maximum Lifetime Spend
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No maximum"
              {...form.register(
                "max_lifetime_spend",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

        </div>

        <div className="space-y-3">

          <div className="flex items-center justify-between rounded-lg border bg-background p-4">

            <div>
              <Label>
                First Order Only
              </Label>

              <p className="text-sm text-muted-foreground">
                Only customers placing their first order can use it.
              </p>
            </div>

            <Switch
              checked={form.watch(
                "first_order_only"
              )}
              onCheckedChange={(
                checked
              ) =>
                form.setValue(
                  "first_order_only",
                  checked,
                  {
                    shouldDirty:
                      true,
                  }
                )
              }
            />

          </div>

          <div className="flex items-center justify-between rounded-lg border bg-background p-4">

            <div>
              <Label>
                New Customer Only
              </Label>

              <p className="text-sm text-muted-foreground">
                Restrict this coupon to new customers.
              </p>
            </div>

            <Switch
              checked={
                newCustomerOnly
              }
              onCheckedChange={(
                checked
              ) =>
                form.setValue(
                  "new_customer_only",
                  checked,
                  {
                    shouldDirty:
                      true,
                  }
                )
              }
            />

          </div>

          <div className="flex items-center justify-between rounded-lg border bg-background p-4">

            <div>
              <Label>
                Existing Customer Only
              </Label>

              <p className="text-sm text-muted-foreground">
                Restrict this coupon to customers with previous orders.
              </p>
            </div>

            <Switch
              checked={
                existingCustomerOnly
              }
              onCheckedChange={(
                checked
              ) =>
                form.setValue(
                  "existing_customer_only",
                  checked,
                  {
                    shouldDirty:
                      true,
                  }
                )
              }
            />

          </div>

        </div>

        {newCustomerOnly &&
          existingCustomerOnly && (
            <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
              New Customer Only and Existing Customer Only cannot
              both be enabled.
            </p>
          )}

      </div>


      {/* =====================================================
          CART CONDITIONS
      ====================================================== */}

      <div className="rounded-xl border bg-muted/30 p-4 sm:p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            🛒 Cart Conditions
          </h3>

          <p className="text-sm text-muted-foreground">
            Add quantity and eligible-item requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <Label>
              Minimum Cart Quantity
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No minimum"
              {...form.register(
                "min_cart_quantity",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

          <div>
            <Label>
              Maximum Cart Quantity
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No maximum"
              {...form.register(
                "max_cart_quantity",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <Label>
              Minimum Eligible Quantity
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No minimum"
              {...form.register(
                "min_eligible_quantity",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

          <div>
            <Label>
              Maximum Eligible Quantity
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No maximum"
              {...form.register(
                "max_eligible_quantity",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <Label>
              Minimum Eligible Subtotal
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="₹0"
              {...form.register(
                "min_eligible_subtotal",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

          <div>
            <Label>
              Maximum Eligible Subtotal
            </Label>

            <Input
              type="number"
              min={0}
              placeholder="No maximum"
              {...form.register(
                "max_eligible_subtotal",
                {
                  setValueAs:
                    nullableNumberValue,
                }
              )}
            />
          </div>

        </div>

        <div>
          <Label>
            Minimum Order Amount
          </Label>

          <Input
            type="number"
            min={0}
            {...form.register(
              "minimum_order_amount",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <p className="mt-1 text-xs text-muted-foreground">
            This applies to the complete cart total.
          </p>
        </div>

      </div>


      {/* =====================================================
          OFFER / STACKING
      ====================================================== */}

      <div className="rounded-xl border bg-muted/30 p-4 sm:p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            ⚙️ Advanced Offer Rules
          </h3>

          <p className="text-sm text-muted-foreground">
            Control stacking and advanced offer behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <Label>
              Offer Type
            </Label>

            <select
              className="w-full rounded-md border px-3 py-2"
              {...form.register(
                "offer_type"
              )}
            >
              <option value="standard">
                Standard Coupon
              </option>

              <option value="buy_x_get_y">
                Buy X Get Y
              </option>
            </select>
          </div>

          <div>
            <Label>
              Coupon Combination
            </Label>

            <select
              className="w-full rounded-md border px-3 py-2"
              {...form.register(
                "stacking_mode"
              )}
            >
              <option value="exclusive">
                Cannot Combine
              </option>

              <option value="stackable">
                Can Combine
              </option>
            </select>
          </div>

        </div>

        {offerType ===
          "buy_x_get_y" && (
          <div className="rounded-lg border bg-background p-4 space-y-4">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <Label>
                  Buy Quantity
                </Label>

                <Input
                  type="number"
                  min={1}
                  {...form.register(
                    "buy_quantity",
                    {
                      setValueAs:
                        nullableNumberValue,
                    }
                  )}
                />
              </div>

              <div>
                <Label>
                  Get Quantity
                </Label>

                <Input
                  type="number"
                  min={1}
                  {...form.register(
                    "get_quantity",
                    {
                      setValueAs:
                        nullableNumberValue,
                    }
                  )}
                />
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <Label>
                  Get Discount Type
                </Label>

                <select
                  className="w-full rounded-md border px-3 py-2"
                  {...form.register(
                    "get_discount_type"
                  )}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed Amount
                  </option>

                  <option value="free">
                    Free
                  </option>
                </select>
              </div>

              <div>
                <Label>
                  Get Discount Value
                </Label>

                <Input
                  type="number"
                  min={0}
                  {...form.register(
                    "get_discount_value",
                    {
                      setValueAs:
                        nullableNumberValue,
                    }
                  )}
                />
              </div>

            </div>

          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border bg-background p-4">

          <div>
            <Label>
              Auto Apply
            </Label>

            <p className="text-sm text-muted-foreground">
              Allow this coupon to be considered for automatic best-offer selection.
            </p>
          </div>

          <Switch
            checked={form.watch(
              "auto_apply"
            )}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "auto_apply",
                checked,
                {
                  shouldDirty:
                    true,
                }
              )
            }
          />

        </div>

        <div>
          <Label>
            Condition Logic
          </Label>

          <select
            className="w-full rounded-md border px-3 py-2"
            {...form.register(
              "condition_logic"
            )}
          >
            <option value="all">
              All configured conditions must match
            </option>

            <option value="any">
              Any configured condition may match
            </option>
          </select>

          <p className="mt-1 text-xs text-muted-foreground">
            Use All for normal coupon restrictions. Any is available
            for advanced rule combinations.
          </p>
        </div>

      </div>


      {/* =====================================================
          CART BANNER SETTINGS
      ====================================================== */}

      <div className="rounded-xl border bg-muted/30 p-4 sm:p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            🛒 Cart Banner Settings
          </h3>

          <p className="text-sm text-muted-foreground">
            Control whether this coupon is promoted in the cart drawer.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-background p-4">

          <div>
            <Label>
              Show in Cart
            </Label>

            <p className="text-sm text-muted-foreground">
              Show this coupon as the promotional banner in the cart.
            </p>
          </div>

          <Switch
            checked={showInCart}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "show_in_cart",
                checked,
                {
                  shouldDirty:
                    true,
                }
              )
            }
          />

        </div>

        {showInCart && (
          <>
            <div>
              <Label>
                Cart Display Text
              </Label>

              <Input
                placeholder="Buy 4 at ₹2999"
                {...form.register(
                  "cart_display_text"
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                This is the main promotional text shown in the cart.
              </p>
            </div>

            <div>
              <Label>
                Display Priority
              </Label>

              <Input
                type="number"
                min={0}
                {...form.register(
                  "cart_display_priority",
                  {
                    valueAsNumber:
                      true,
                  }
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                Used to order multiple active cart promotions.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Cart Preview
              </p>

              <p className="mt-2 text-sm font-semibold">
                ✨{" "}
                {cartDisplayText?.trim() ||
                  "Your promotional offer"}{" "}
                | Use Code :{" "}
                {couponCode?.trim().toUpperCase() ||
                  "COUPONCODE"}
              </p>
            </div>
          </>
        )}

      </div>


      {/* =====================================================
          SPIN WHEEL SETTINGS
      ====================================================== */}

      <div className="rounded-xl border bg-muted/30 p-4 sm:p-5 space-y-5">

        <div>
          <h3 className="text-lg font-semibold">
            🎡 Spin Wheel Settings
          </h3>

          <p className="text-sm text-muted-foreground">
            Configure this coupon for the Spin Wheel.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-background p-4">

          <div>
            <Label>
              Enable for Spin Wheel
            </Label>

            <p className="text-sm text-muted-foreground">
              Allow this coupon to appear as a Spin Wheel reward.
            </p>
          </div>

          <Switch
            checked={spinEnabled}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "spin_enabled",
                checked
              )
            }
          />

        </div>

        {spinEnabled && (
          <>
            <div>
              <Label>
                Reward Display Name
              </Label>

              <Input
                placeholder="20% OFF"
                {...form.register(
                  "reward_display_name"
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                This text will be shown on the Spin Wheel.
              </p>
            </div>

            <div>
              <Label>
                Probability Weight
              </Label>

              <Input
                type="number"
                min={1}
                {...form.register(
                  "spin_probability",
                  {
                    valueAsNumber:
                      true,
                  }
                )}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                Higher numbers increase the chance of winning this reward.
              </p>
            </div>
          </>
        )}

      </div>


      {/* =====================================================
          USAGE / DATES
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <Label>
            Usage Limit
          </Label>

          <Input
            type="number"
            min={0}
            placeholder="Unlimited"
            {...form.register(
              "usage_limit",
              {
                setValueAs:
                  nullableNumberValue,
              }
            )}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 mt-6">

          <Label>
            One Use Per Customer
          </Label>

          <Switch
            checked={form.watch(
              "one_use_per_customer"
            )}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "one_use_per_customer",
                checked,
                {
                  shouldDirty:
                    true,
                }
              )
            }
          />

        </div>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <Label>
            Start Date
          </Label>

          <Input
            type="datetime-local"
            {...form.register(
              "starts_at"
            )}
          />
        </div>

        <div>
          <Label>
            Expiry Date
          </Label>

          <Input
            type="datetime-local"
            {...form.register(
              "expires_at"
            )}
          />
        </div>

      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">

        <Label>
          Active Coupon
        </Label>

        <Switch
          checked={form.watch(
            "is_active"
          )}
          onCheckedChange={(
            checked
          ) =>
            form.setValue(
              "is_active",
              checked,
              {
                shouldDirty:
                  true,
              }
            )
          }
        />

      </div>


      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            form.reset()
          }
        >
          Reset
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {isEditing
            ? "Update Coupon"
            : "Create Coupon"}
        </Button>

      </div>

    </form>
  );
}
