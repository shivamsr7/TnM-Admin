import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
  onRefresh: () => void;
  totalProducts?: number;
}

export default function ProductToolbar({
  search,
  onSearchChange,
  onAddProduct,
  onRefresh,
  totalProducts = 0,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by product name, SKU, category or brand..."
          className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 text-sm shadow-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-0"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 sm:inline-flex">
          {totalProducts} {totalProducts === 1 ? "product" : "products"}
        </span>

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          className="h-11 rounded-xl border-slate-200 px-3.5"
          title="Refresh products"
        >
          <RefreshCw className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button
          type="button"
          onClick={onAddProduct}
          className="h-11 rounded-xl bg-slate-950 px-4 font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
