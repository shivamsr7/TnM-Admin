import ProductActionsMenu from "./ProductActionsMenu";
import ProductStatusBadge from "./ProductStatusBadge";

export interface ProductTableItem {
  id: string;
  name: string;
  sku: string;
  image?: string;
  category?: string;
  brand?: string;
  price: number;
  stock: number;
  status:
    | "active"
    | "draft"
    | "hidden"
    | "archived"
    | "out_of_stock";
}

interface ProductTableProps {
  products: ProductTableItem[];
  selectedProducts: string[];
  onSelectionChange: (ids: string[]) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  selectedProducts,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <span className="text-xl">⌕</span>
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No products found
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(products.map((product) => product.id));
    }
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      onSelectionChange(
        selectedProducts.filter((productId) => productId !== id)
      );
    } else {
      onSelectionChange([...selectedProducts, id]);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-20 w-12 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    selectedProducts.length === products.length
                  }
                  onChange={handleSelectAll}
                  aria-label="Select all products"
                  className="h-4 w-4 rounded border-slate-300"
                />
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Product
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                SKU
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Category
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Brand
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Price
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Stock
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Status
              </th>

              <th className="sticky right-0 z-30 min-w-[92px] border-b border-l border-slate-200 bg-slate-50 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 shadow-[-8px_0_14px_-12px_rgba(15,23,42,0.5)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => {
              const isSelected = selectedProducts.includes(product.id);
              const rowBase =
                index % 2 === 0 ? "bg-white" : "bg-slate-50/40";

              return (
                <tr
                  key={product.id}
                  className={`${rowBase} group transition-colors hover:bg-slate-50`}
                >
                  <td
                    className={`sticky left-0 z-10 border-b border-slate-100 px-4 py-4 ${rowBase} group-hover:bg-slate-50`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProduct(product.id)}
                      aria-label={`Select ${product.name}`}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>

                  <td className="min-w-[320px] border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <img
                          src={
                            product.image ||
                            "https://placehold.co/100x100"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 truncate text-[11px] text-slate-400">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap border-b border-slate-100 px-5 py-4 font-mono text-xs text-slate-600">
                    {product.sku}
                  </td>

                  <td className="whitespace-nowrap border-b border-slate-100 px-5 py-4 text-sm text-slate-700">
                    {product.category || "-"}
                  </td>

                  <td className="whitespace-nowrap border-b border-slate-100 px-5 py-4 text-sm text-slate-700">
                    {product.brand || "-"}
                  </td>

                  <td className="whitespace-nowrap border-b border-slate-100 px-5 py-4 text-right text-sm font-semibold text-slate-900">
                    ₹{product.price.toLocaleString()}
                  </td>

                  <td className="border-b border-slate-100 px-5 py-4 text-center">
                    <span
                      className={`inline-flex min-w-10 justify-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        product.stock <= 0
                          ? "bg-red-50 text-red-700"
                          : product.stock <= 5
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="border-b border-slate-100 px-5 py-4 text-center">
                    <ProductStatusBadge status={product.status} />
                  </td>

                  <td
                    className={`sticky right-0 z-10 border-b border-l border-slate-200 px-4 py-4 text-center shadow-[-8px_0_14px_-12px_rgba(15,23,42,0.5)] ${rowBase} group-hover:bg-slate-50`}
                  >
                    <div className="flex justify-center">
                      <ProductActionsMenu
                        productId={product.id}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
