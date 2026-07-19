import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import SectionCard from "@/shared/components/admin/SectionCard";
import MediaUploader from "@/shared/components/media/MediaUploader";

import {
  collectionSchema,
  type CollectionFormValues,
} from "../schemas/collection.schema";

import type { Collection } from "../types/collection.types";

import {
  useCreateCollection,
  useUpdateCollection,
} from "../hooks/useCollections";

interface CollectionFormProps {
  collection?: Collection;
}

export default function CollectionForm({
  collection,
}: CollectionFormProps) {
  const navigate = useNavigate();

  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      banner_image: "",
      is_active: true,
      sort_order: 0,
    },
  });

  const name = watch("name");

  useEffect(() => {
    if (collection) return;

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setValue("slug", slug);
  }, [name, collection, setValue]);

  useEffect(() => {
    if (!collection) return;

    setValue("name", collection.name);
    setValue("slug", collection.slug);
    setValue("description", collection.description ?? "");
    setValue("banner_image", collection.banner_image ?? "");
    setValue("is_active", collection.is_active);
    setValue("sort_order", collection.sort_order);
  }, [collection, setValue]);

  async function onSubmit(values: CollectionFormValues) {
    try {
      if (collection) {
        await updateCollection.mutateAsync({
          id: collection.id,
          data: values,
        });
      } else {
        await createCollection.mutateAsync(values);
      }

      navigate("/collections");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <SectionCard
        title="Collection Information"
        description="Manage your jewelry collection."
      >
        <div className="grid gap-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <Input
              {...register("name")}
              placeholder="Summer Collection"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>

            <Input
              {...register("slug")}
              placeholder="summer-collection"
            />

            {errors.slug && (
              <p className="mt-1 text-sm text-red-500">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Textarea
              rows={5}
              {...register("description")}
            />
          </div>

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
          </div>

        </div>
      </SectionCard>

      <SectionCard
        title="Banner Image"
        description="Upload a banner image for this collection."
      >
        <MediaUploader
          folder="collections"
          value={watch("banner_image")}
          onChange={(url) =>
            setValue("banner_image", url)
          }
        />
      </SectionCard>

      <SectionCard
        title="Status"
        description="Enable or disable this collection."
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">
            Active Collection
          </span>

          <Switch
            checked={watch("is_active")}
            onCheckedChange={(checked) =>
              setValue("is_active", checked)
            }
          />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            createCollection.isPending ||
            updateCollection.isPending
          }
        >
          {collection
            ? "Update Collection"
            : "Create Collection"}
        </Button>
      </div>
    </form>
  );
}