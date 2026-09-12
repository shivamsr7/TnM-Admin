import { useMemo, useState } from "react";
import {
  ChevronRight,
  FolderTree,
  Layers3,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/SearchBar";

import CategoryTable from "../components/CategoryTable";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../types/category.types";
import CategoryDialog from "../components/CategoryDialog";
import DeleteCategoryDialog from "../components/DeleteCategoryDialog";
import ManageSubcategoriesDialog from "../components/ManageSubcategoriesDialog";

export default function CategoriesPage() {
  const { data = [], isLoading } = useCategories();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [subcategoriesDialog, setSubcategoriesDialog] = useState(false);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [data, search]);

  const parentCategories = useMemo(
    () =>
      data.filter((category) => {
        const categoryWithParent = category as Category & {
          parent_id?: string | null;
        };

        return !categoryWithParent.parent_id;
      }).length,
    [data]
  );

  const openAddDialog = () => {
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 pb-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="relative px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-slate-100/70 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <span>Catalog</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-slate-600">Categories</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm sm:flex">
                  <FolderTree className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Categories
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Organize your catalog into clear, easy-to-manage product groups.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={openAddDialog}
              className="h-11 w-full rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Total categories
              </p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950">
                {data.length}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Layers3 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Main categories
              </p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950">
                {parentCategories}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FolderTree className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Showing
              </p>
              <p className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-slate-950">
                {filteredCategories.length}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          {search.trim() && (
            <p className="mt-1 text-xs text-slate-400">
              Matching “{search.trim()}”
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                All categories
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Search, edit, delete, or manage subcategories.
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <div className="[&_input]:h-10 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:pl-10 [&_input]:text-sm [&_input]:shadow-none [&_input]:focus:border-slate-400 [&_input]:focus:ring-0">
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search categories..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto">
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
            onManageSubcategories={(category) => {
              setSelectedCategory(category);
              setSubcategoriesDialog(true);
            }}
          />
        </div>

        {filteredCategories.length === 0 && (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              No categories found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try a different search term.
            </p>
          </div>
        )}
      </section>

      <CategoryDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        category={selectedCategory}
        categories={data}
      />

      <DeleteCategoryDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        category={selectedCategory}
      />

      <ManageSubcategoriesDialog
        open={subcategoriesDialog}
        onOpenChange={setSubcategoriesDialog}
        category={selectedCategory}
      />
    </div>
  );
}
