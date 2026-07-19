import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

import CategoryTable from "../components/CategoryTable";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../types/category.types";
import CategoryDialog from "../components/CategoryDialog";
import DeleteCategoryDialog from "../components/DeleteCategoryDialog";
export default function CategoriesPage() {
  const { data = [], isLoading } = useCategories();

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return data;

    return data.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Categories"
        description="Manage product categories"
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="w-full md:max-w-sm">
          <SearchBar
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search categories..."
          />
        </div>

        <Button
          onClick={() => {
            setSelectedCategory(null);
            setOpenDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />

          Add Category
        </Button>

      </div>

      <CategoryTable
        data={filteredCategories}
        onEdit={(category) => {
          setSelectedCategory(category);
          setOpenDialog(true);
        }}
        onDelete={(category) => {
          setSelectedCategory(category);
          setDeleteDialog(true);
        }}
      />

      {/* Category Dialog */}
<CategoryDialog
  open={openDialog}
  onOpenChange={setOpenDialog}
  category={selectedCategory}
  categories={data}
/>
      {/* Delete Dialog */}
<DeleteCategoryDialog
  open={deleteDialog}
  onOpenChange={setDeleteDialog}
  category={selectedCategory}
/>
    </div>
  );
}