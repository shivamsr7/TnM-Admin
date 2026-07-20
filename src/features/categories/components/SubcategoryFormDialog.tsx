import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Category } from "../types/category.types";
import type { Subcategory } from "../types/subcategory.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  category: Category;

  subcategory?: Subcategory | null;

  onSave: (data: {
    name: string;
    description: string;
    sort_order: number;
    is_active: boolean;
  }) => void;

  isSaving?: boolean;
}

export default function SubcategoryFormDialog({
  open,
  onOpenChange,
  category,
  subcategory,
  onSave,
  isSaving = false,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (subcategory) {
      setName(subcategory.name);
      setDescription(subcategory.description ?? "");
      setSortOrder(subcategory.sort_order);
      setIsActive(subcategory.is_active);
    } else {
      setName("");
      setDescription("");
      setSortOrder(0);
      setIsActive(true);
    }
  }, [subcategory, open]);

  function handleSubmit() {
    if (!name.trim()) return;

    onSave({
      name,
      description,
      sort_order: sortOrder,
      is_active: isActive,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">

        <DialogHeader>
          <DialogTitle>
            {subcategory ? "Edit Subcategory" : "Add Subcategory"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div>
            <Label>Category</Label>

            <Input
              value={category.name}
              disabled
            />
          </div>

          <div>
            <Label>Subcategory Name</Label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subcategory name"
            />
          </div>

          <div>
            <Label>Description</Label>

            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div>
            <Label>Sort Order</Label>

            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />

            Active
          </label>

          <div className="flex justify-end gap-3">

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {subcategory ? "Update" : "Create"}
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}