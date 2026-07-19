import type { UseFormReturn } from "react-hook-form";

import SectionCard from "@/shared/components/admin/SectionCard";
import MultiSelect from "@/shared/components/select/MultiSelect";
import SearchableSelect from "@/shared/components/select/SearchableSelect";
import ToggleCard from "@/shared/components/select/ToggleCard";

import type { ProductSchema } from "../../schemas/product.schema";

interface Option {
  id: string;
  name: string;
}

interface Props {
  form: UseFormReturn<ProductSchema>;

  categories: Option[];
  brands: Option[];
  collections: Option[];
  tags: Option[];
}

export default function OrganizationSection({
  form,
  categories,
  brands,
  collections,
  tags,
}: Props) {
  const { watch, setValue } = form;

  return (
    <SectionCard
      title="Organization"
      description="Assign categories, brands, collections, tags and product visibility."
    >
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <SearchableSelect
            label="Category"
            value={watch("category_id")}
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            onChange={(value) =>
              setValue("category_id", value, {
                shouldDirty: true,
              })
            }
          />

          <SearchableSelect
            label="Brand"
            value={watch("brand_id") ?? ""}
            options={brands.map((brand) => ({
              value: brand.id,
              label: brand.name,
            }))}
            onChange={(value) =>
              setValue("brand_id", value, {
                shouldDirty: true,
              })
            }
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <MultiSelect
            label="Collections"
            value={watch("collection_ids") ?? []}
            options={collections.map((collection) => ({
              value: collection.id,
              label: collection.name,
            }))}
            onChange={(value) =>
              setValue("collection_ids", value, {
                shouldDirty: true,
              })
            }
          />

          <MultiSelect
            label="Tags"
            value={watch("tag_ids") ?? []}
            options={tags.map((tag) => ({
              value: tag.id,
              label: tag.name,
            }))}
            onChange={(value) =>
              setValue("tag_ids", value, {
                shouldDirty: true,
              })
            }
          />
        </div>

        <div className="space-y-4">
          <ToggleCard
            title="Featured Product"
            description="Display this product in featured sections across the website."
            checked={watch("is_featured")}
            onChange={(checked) =>
              setValue("is_featured", checked, {
                shouldDirty: true,
              })
            }
          />

          <ToggleCard
            title="New Arrival"
            description="Highlight this product in the New Arrivals collection."
            checked={watch("is_new")}
            onChange={(checked) =>
              setValue("is_new", checked, {
                shouldDirty: true,
              })
            }
          />

          <ToggleCard
            title="Best Seller"
            description="Show this product in the Best Sellers section."
            checked={watch("is_best_seller")}
            onChange={(checked) =>
              setValue("is_best_seller", checked, {
                shouldDirty: true,
              })
            }
          />
        </div>
      </div>
    </SectionCard>
  );
}