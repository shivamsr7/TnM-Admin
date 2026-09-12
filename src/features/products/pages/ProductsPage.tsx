import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Archive,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Package,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import ProductToolbar from "../components/ProductToolbar";
import ProductTable from "../components/ProductTable";
import type { ProductTableItem } from "../components/ProductTable";
import ProductBulkActions from "../components/ProductBulkActions";
import ProductFilters from "../components/ProductFilters";
import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import { productService } from "../services/product.service";

export default function ProductsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const [products, setProducts] = useState<ProductTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await productService.getAll();

      const mappedProducts: ProductTableItem[] = (data ?? []).map(
        (product: any) => ({
          id: product.id,
          name: product.name,
          sku: product.sku ?? "-",
          image:
            product.product_images?.find(
              (img: any) => img.is_primary
            )?.image_url ??
            product.product_images?.[0]?.image_url ??
            "",
          category: product.categories?.name ?? "-",
          brand: product.brands?.name ?? "-",
          price: product.price,
          stock: product.stock,
          status:
            product.stock <= 0
              ? "out_of_stock"
              : product.status,
        })
      );

      setProducts(mappedProducts);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      filtered = filtered.filter((product) => {
        return (
          product.name.toLowerCase().includes(keyword) ||
          product.sku.toLowerCase().includes(keyword) ||
          (product.category ?? "").toLowerCase().includes(keyword) ||
          (product.brand ?? "").toLowerCase().includes(keyword)
        );
      });
    }

    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "all") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    if (status !== "all") {
      filtered = filtered.filter((p) => p.status === status);
    }

    switch (sort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "stock":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case "oldest":
        filtered.reverse();
        break;
      default:
        break;
    }

    return filtered;
  }, [products, search, category, brand, status, sort]);

  const handleRefresh = async () => {
    await loadProducts();
  };

  const handleView = (id: string) => {
    console.log("View", id);
  };

  const handleEdit = (id: string) => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    const product = products.find((p) => p.id === id);

    if (!product) return;

    setDeleteId(id);
    setDeleteName(product.name);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);

      await productService.delete(deleteId);

      toast.success("Product deleted successfully.");

      await loadProducts();

      setDeleteId(null);
      setDeleteName("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = products.filter(
    (product) => product.status === "active"
  ).length;

  const outOfStockCount = products.filter(
    (product) =>
      product.stock <= 0 ||
      product.status === "out_of_stock"
  ).length;

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Package className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-800">
            Loading products
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Fetching your catalog...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Unable to load products
            </h2>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setStatus("all");
    setSort("newest");
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    category !== "all" ||
    brand !== "all" ||
    status !== "all" ||
    sort !== "newest";

  return (
    <div className="min-w-0 space-y-5 pb-8">
      {/* Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="relative px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-slate-100 blur-3xl" />

          <div className="relative">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span>Catalog</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-600">Products</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white sm:flex">
                <Package className="h-5 w-5" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Products
                  </h1>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {products.length} total
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage your jewellery catalog, inventory, visibility and product details from one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory overview */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Total products
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {products.length}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Boxes className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Complete catalog</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Active
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {activeCount}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Currently visible</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Low stock
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {lowStockCount}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">5 units or fewer</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Out of stock
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {outOfStockCount}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Archive className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Needs attention</p>
        </div>
      </section>

      {/* Search + filters */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-500" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Product workspace
              </h2>
              <p className="text-xs text-slate-500">
                Search, filter and manage your catalog.
              </p>
            </div>
          </div>

          <ProductToolbar
            search={search}
            onSearchChange={setSearch}
            onRefresh={handleRefresh}
            onAddProduct={() => navigate("/products/add")}
            totalProducts={filteredProducts.length}
          />
        </div>

        <div className="bg-slate-50/60 px-4 py-4 sm:px-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Filters & sorting
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Refine the products shown below.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="shrink-0 text-xs font-semibold text-slate-600 underline-offset-4 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <ProductFilters
            category={category}
            brand={brand}
            status={status}
            sort={sort}
            onCategoryChange={setCategory}
            onBrandChange={setBrand}
            onStatusChange={setStatus}
            onSortChange={setSort}
          />
        </div>

        {selectedProducts.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
            <ProductBulkActions
              selectedCount={selectedProducts.length}
              onPublish={() => console.log("Publish")}
              onDraft={() => console.log("Draft")}
              onDelete={() => console.log("Bulk Delete")}
              onClear={() => setSelectedProducts([])}
            />
          </div>
        )}
      </section>

      {/* Catalog */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Product catalog
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
              {search.trim() ? ` matching “${search.trim()}”` : ""}.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Search className="h-3.5 w-3.5" />
            <span>
              {selectedProducts.length > 0
                ? `${selectedProducts.length} selected`
                : "Select products for bulk actions"}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <ProductTable
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onSelectionChange={setSelectedProducts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </section>

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDeleteId(null);
            setDeleteName("");
          }
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
