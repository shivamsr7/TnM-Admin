import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CategoryForm from "./CategoryForm";

import {
  useCreateCategory,
  useUpdateCategory,
} from "../hooks/useCategories";

import type {
  Category,
  CategoryFormData,
} from "../types/category.types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
}

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  categories,
}: CategoryDialogProps) {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const isEditing = !!category;

  const loading =
    createMutation.isPending ||
    updateMutation.isPending;

  const handleSubmit = async (
    data: CategoryFormData
  ) => {
    try {
      if (isEditing && category) {
        await updateMutation.mutateAsync({
          id: category.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      onOpenChange(false);
    } catch {
      // Toast handled in mutation hooks
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Category"
              : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <CategoryForm
          initialData={category}
          categories={categories}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}