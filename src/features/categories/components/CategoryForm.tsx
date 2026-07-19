import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  categorySchema,
  type CategorySchema,
} from "../schemas/category.schema";

import type {
  Category,
  CategoryFormData,
} from "../types/category.types";

interface CategoryFormProps {
  initialData?: Category | null;
  categories: Category[];
  loading?: boolean;
  onSubmit: (data: CategoryFormData) => void;
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function CategoryForm({
  initialData,
  categories,
  loading,
  onSubmit,
}: CategoryFormProps) {
  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent_id: null,
      sort_order: 0,
      is_active: true,
    },
  });

  const { register, watch, setValue, handleSubmit } = form;

  const name = watch("name");

  useEffect(() => {
    if (!initialData) {
      setValue("slug", generateSlug(name));
    }
  }, [name, initialData, setValue]);

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      name: initialData.name,
      slug: initialData.slug,
      description: initialData.description ?? "",
      parent_id: initialData.parent_id,
      sort_order: initialData.sort_order,
      is_active: initialData.is_active,
    });
  }, [initialData, form]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-5"
    >
      <div>
        <Label>Category Name</Label>

        <Input
          {...register("name")}
          placeholder="Enter category name"
        />
      </div>

      <div>
        <Label>Slug</Label>

        <Input
          {...register("slug")}
        />
      </div>

      <div>
        <Label>Description</Label>

        <Textarea
          {...register("description")}
          rows={4}
        />
      </div>

      <div>
        <Label>Parent Category</Label>

        <Select
          onValueChange={(value) =>
            setValue(
              "parent_id",
              value === "none" ? null : value
            )
          }
          defaultValue={
            initialData?.parent_id ?? "none"
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="None" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="none">
              None
            </SelectItem>

            {categories
              .filter(
                (c) => c.id !== initialData?.id
              )
              .map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </SelectItem>
              ))}

          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sort Order</Label>

        <Input
          type="number"
          {...register("sort_order", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="font-medium">
            Active
          </p>

          <p className="text-sm text-gray-500">
            Show this category on the website.
          </p>
        </div>

        <Switch
          checked={watch("is_active")}
          onCheckedChange={(checked) =>
            setValue("is_active", checked)
          }
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Category"
          : "Create Category"}
      </Button>
    </form>
  );
}