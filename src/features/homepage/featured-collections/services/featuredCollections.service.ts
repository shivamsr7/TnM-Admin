import { supabase } from "@/lib/supabase";

import type {
  AddFeaturedCollectionPayload,
  FeaturedCollection,
} from "../types/featuredCollection.types";

export const featuredCollectionsService = {
  async getFeaturedCollections(): Promise<
    FeaturedCollection[]
  > {
    const { data, error } = await supabase
      .from("homepage_featured_collections")
      .select(`
  *,
  collection:collections(
    id,
    name,
    slug,
    thumbnail_image
  )
`)
      .order("display_order", {
        ascending: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as FeaturedCollection[];
  },

  async addCollection(
    values: AddFeaturedCollectionPayload
  ) {
    const { error } = await supabase
      .from("homepage_featured_collections")
      .insert(values);

    if (error) {
      throw new Error(error.message);
    }
  },

  async removeCollection(id: string) {
    const { error } = await supabase
      .from("homepage_featured_collections")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },

  async toggleStatus(
  id: string,
  is_active: boolean
) {
  const { error } = await supabase
    .from("homepage_featured_collections")
    .update({
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
},

  async reorder(ids: string[]) {
  const updates = ids.map((id, index) => ({
    id,
    display_order: index + 1,
  }));

  const promises = updates.map((item) =>
    supabase
      .from("homepage_featured_collections")
      .update({
        display_order: item.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id)
  );

  const results = await Promise.all(promises);

  const failed = results.find((r) => r.error);

  if (failed?.error) throw failed.error;
},
  async update(
  id: string,
  values: {
    collection_id: string;
    display_order: number;
    is_active: boolean;
  }
) {
  const { data, error } = await supabase
    .from("homepage_featured_collections")
    .update({
      collection_id: values.collection_id,
      display_order: values.display_order,
      is_active: values.is_active,
    })
    .eq("id", id)
    .select(
      `
      *,
      collection:collections(
        id,
        name,
        slug,
        thumbnail_image
      )
      `
    )
    .single();

  if (error) throw error;

  return data;
}
};