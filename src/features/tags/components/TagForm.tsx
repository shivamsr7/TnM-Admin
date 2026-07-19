import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SectionCard from "@/shared/components/admin/SectionCard";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  tagSchema,
  type TagSchema,
} from "../schemas/tag.schema";

import type { Tag } from "../types/tag.types";

import {
  useCreateTag,
  useUpdateTag,
} from "../hooks/useTags";

interface TagFormProps {
  tag?: Tag;
}

export default function TagForm({
  tag,
}: TagFormProps) {
  const navigate = useNavigate();

  const createTag = useCreateTag();
  const updateTag = useUpdateTag();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      is_active: true,
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (!tag) return;

    reset({
      name: tag.name,
      slug: tag.slug,
      description: tag.description ?? "",
      is_active: tag.is_active,
      sort_order: tag.sort_order,
    });
  }, [tag, reset]);

  const name = watch("name");

  useEffect(() => {
    if (tag) return;

    setValue(
      "slug",
      name
        ?.toLowerCase()
        .trim()
        .replace(/\s+/g, "-") ?? ""
    );
  }, [name, tag, setValue]);

  async function onSubmit(values: TagSchema) {
    const payload = {
      ...values,
      description: values.description ?? "",
    };

    if (tag) {
      await updateTag.mutateAsync({
        id: tag.id,
        values: payload,
      });
    } else {
      await createTag.mutateAsync(payload);
    }

    navigate("/tags");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <SectionCard
        title="Tag Information"
        description="Basic details about the tag."
      >
        <div className="grid gap-6 md:grid-cols-2">

          {/* Name */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <Input
              placeholder="Tag name"
              {...register("name")}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>

            <Input
              placeholder="tag-slug"
              {...register("slug")}
            />

            {errors.slug && (
              <p className="mt-1 text-sm text-red-500">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Textarea
              rows={4}
              placeholder="Description..."
              {...register("description")}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
                    {/* Sort Order */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Sort Order
            </label>

            <Input
              type="number"
              {...register("sort_order", {
                valueAsNumber: true,
              })}
            />

            {errors.sort_order && (
              <p className="mt-1 text-sm text-red-500">
                {errors.sort_order.message}
              </p>
            )}
          </div>

          {/* Active */}

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-medium">
                Active
              </h3>

              <p className="text-sm text-muted-foreground">
                Enable this tag for products.
              </p>
            </div>

            <Switch
              checked={watch("is_active")}
              onCheckedChange={(checked) =>
                setValue("is_active", checked)
              }
            />
          </div>

        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/tags")}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            createTag.isPending ||
            updateTag.isPending
          }
        >
          {createTag.isPending ||
          updateTag.isPending
            ? tag
              ? "Updating..."
              : "Creating..."
            : tag
            ? "Update Tag"
            : "Create Tag"}
        </Button>
      </div>
    </form>
  );
}