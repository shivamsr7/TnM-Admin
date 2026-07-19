import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import BrandsTable from "../components/BrandsTable";
import {
  useBrands,
  useDeleteBrand,
} from "../hooks/useBrands";
import type { Brand } from "../types/brand.types";

export default function BrandsPage() {
  const [search, setSearch] = useState("");

  const { data: brands = [], isLoading } = useBrands();

  const deleteBrand = useDeleteBrand();

  const filteredBrands = useMemo(() => {
    const keyword = search.toLowerCase();

    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(keyword) ||
        brand.slug.toLowerCase().includes(keyword)
    );
  }, [brands, search]);

 async function handleDelete(brand: Brand) {
  try {
    await deleteBrand.mutateAsync(brand.id);

    toast.success("Brand deleted successfully");
  } catch (error) {
    console.error(error);

    toast.error("Failed to delete brand");
  }
}

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        Loading brands...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Brands
          </h1>

          <p className="text-muted-foreground">
            Manage all product brands.
          </p>
        </div>

        <Button asChild>
          <Link to="/brands/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Link>
        </Button>
      </div>

      {/* Search */}

      <Input
        placeholder="Search brands..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* Table */}

      <BrandsTable
        brands={filteredBrands}
        onDelete={handleDelete}
      />
    </div>
  );
}