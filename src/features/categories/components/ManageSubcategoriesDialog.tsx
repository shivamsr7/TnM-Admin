import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil,
  Trash2,
} from "lucide-react";


import { Button } from "@/components/ui/button";

import type { Category } from "../types/category.types";
import {
  useCreateSubcategory,
  useDeleteSubcategory,
  useSubcategories,
  useUpdateSubcategory,
} from "../hooks/useSubcategories";
import { useState } from "react";
import SubcategoryFormDialog from "./SubcategoryFormDialog";

import type { Subcategory } from "../types/subcategory.types";

interface ManageSubcategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export default function ManageSubcategoriesDialog({
  open,
  onOpenChange,
  category,
}: ManageSubcategoriesDialogProps) {
  if (!category) return null;
const [formOpen, setFormOpen] = useState(false);

const [editing, setEditing] =
  useState<Subcategory | null>(null);

const createMutation = useCreateSubcategory();
const updateMutation =
  useUpdateSubcategory(category.id);

const deleteMutation =
  useDeleteSubcategory(category.id);
  
  const {
    data: subcategories = [],
    isLoading,
  } = useSubcategories(category.id);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Manage Subcategories
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">
            {category.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage all subcategories under this category.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h4 className="font-semibold">
            Subcategories
          </h4>

          <Button
  onClick={() => {
    setEditing(null);
    setFormOpen(true);
  }}
>
  + Add Subcategory
</Button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            Loading subcategories...
          </div>
        ) : subcategories.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center text-gray-500">
            No subcategories found.
          </div>
        ) : (
          <div className="space-y-3">
            {subcategories.map((subcategory) => (
              <div
  key={subcategory.id}
  className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
>
  <div className="flex-1">

    <h5 className="font-medium">
      {subcategory.name}
    </h5>

    {subcategory.description && (
      <p className="mt-1 text-sm text-gray-500">
        {subcategory.description}
      </p>
    )}

    <p className="mt-2 text-xs text-gray-400">
      Sort Order : {subcategory.sort_order}
    </p>

  </div>

  <div className="flex items-center gap-2">

    <Button
      size="icon"
      variant="outline"
      onClick={() => {
        setEditing(subcategory);
        setFormOpen(true);
      }}
    >
      <Pencil className="h-4 w-4" />
    </Button>

    <Button
      size="icon"
      variant="destructive"
      onClick={() => {
        if (
          confirm(
            `Delete "${subcategory.name}"?`
          )
        ) {
          deleteMutation.mutate(subcategory.id);
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>

  </div>
</div>
            ))}
          </div>
        )}
      </DialogContent>
      <SubcategoryFormDialog
  open={formOpen}
  onOpenChange={setFormOpen}
  category={category}
  subcategory={editing}
  isSaving={createMutation.isPending}
onSave={(data) => {
  if (editing) {
    updateMutation.mutate(
      {
        id: editing.id,
        data,
      },
      {
        onSuccess: () => {
          setEditing(null);
          setFormOpen(false);
        },
      }
    );

    return;
  }

  createMutation.mutate(
    {
      category_id: category.id,
      ...data,
    },
    {
      onSuccess: () => {
        setFormOpen(false);
      },
    }
  );
}}
/>
    </Dialog>
    
  );
}