import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import SectionCard from "@/shared/components/admin/SectionCard";
import ToggleCard from "@/shared/components/select/ToggleCard";

import {
  brandSchema,
  type BrandSchema,
} from "../schemas/brand.schema";

import {
  useCreateBrand,
  useUpdateBrand,
} from "../hooks/useBrands";

import type { Brand } from "../types/brand.types";

interface Props {
  brand?: Brand;
}

export default function BrandForm({
  brand,
}: Props) {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();

  const form = useForm<BrandSchema>({
    resolver: zodResolver(brandSchema),

    defaultValues: {
      name: brand?.name ?? "",
      slug: brand?.slug ?? "",
      logo_url: brand?.logo_url ?? "",
      description: brand?.description ?? "",
      website: brand?.website ?? "",
      is_active: brand?.is_active ?? true,
    },
  });

  const { register, watch, setValue, handleSubmit } = form;

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name !== "name") return;

      const slug =
        values.name
          ?.toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ?? "";

      setValue("slug", slug);
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  async function onSubmit(values: BrandSchema) {
    try {
      setSaving(true);

      if (brand) {
        await updateBrand.mutateAsync({
          id: brand.id,
          data: values,
        });

        toast.success("Brand updated successfully");
      } else {
        await createBrand.mutateAsync(values);

        toast.success("Brand created successfully");
      }

      navigate("/admin/brands");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {brand ? "Edit Brand" : "Add Brand"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your jewelry brands.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Brand"}
          </Button>
        </div>
      </div>

      {/* Brand Information */}

      <SectionCard
        title="Brand Information"
        description="Basic information about your brand."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand Name
            </label>

            <input
              {...register("name")}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Pandora"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>

            <input
              {...register("slug")}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Website
            </label>

            <input
              {...register("website")}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Logo URL
            </label>

            <input
              {...register("logo_url")}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            {...register("description")}
            rows={4}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Write a short description..."
          />
        </div>
      </SectionCard>

      {/* Status */}

      <SectionCard
        title="Status"
        description="Control whether this brand is active."
      >
        <ToggleCard
          title="Active Brand"
          description="Inactive brands won't appear on the website."
          checked={watch("is_active")}
          onChange={(checked) =>
            setValue("is_active", checked, {
              shouldDirty: true,
            })
          }
        />
      </SectionCard>

      {/* Footer */}

      <div className="sticky bottom-0 z-20 flex justify-end gap-3 rounded-xl border bg-background/95 p-4 backdrop-blur">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Brand"}
        </Button>
      </div>
    </form>
  );
}