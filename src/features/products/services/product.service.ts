import { supabase } from "@/lib/supabase";
import type {
  Product,
  ProductFormData,
} from "../types/product.types";
import type { ProductImage } from "@/shared/components/media/MediaUploader";

const TABLE = "products";

export const productService = {
  async getAll() {
    const { data, error } = await supabase
  .from(TABLE)
  .select(`
    *,
    categories(name),
    brands(name),
    product_images(
      image_url,
      is_primary,
      sort_order
    )
  `)
  .order("created_at", {
    ascending: false,
  });

    if (error) throw error;

    return data;
  },

  async getById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      product_collections(
        collection_id
      ),
      product_tags(
        tag_id
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
},

  async create(data: ProductFormData) {
    const { data: product, error } =
      await supabase
        .from(TABLE)
        .insert(data)
        .select()
        .single();

    if (error) throw error;

    return product as Product;
  },

  async createProductImages(
    productId: string,
    images: ProductImage[]
  ) {
    if (!images.length) return;

    const payload = images.map((image) => ({
      product_id: productId,
      image_url: image.url,
      sort_order: image.sortOrder,
      is_primary: image.isCover,
    }));

    const { error } = await supabase
      .from("product_images")
      .insert(payload);

    if (error) throw error;
  },

  async createProductCollections(
    productId: string,
    collectionIds: string[]
  ) {
    if (!collectionIds.length) return;

    const payload = collectionIds.map(
      (collectionId) => ({
        product_id: productId,
        collection_id: collectionId,
      })
    );

    const { error } = await supabase
      .from("product_collections")
      .insert(payload);

    if (error) throw error;
  },
async replaceProductCollections(
  productId: string,
  collectionIds: string[]
) {
  const { error: deleteError } = await supabase
    .from("product_collections")
    .delete()
    .eq("product_id", productId);

  if (deleteError) throw deleteError;

  if (!collectionIds.length) return;

  const payload = collectionIds.map((collectionId) => ({
    product_id: productId,
    collection_id: collectionId,
  }));

  const { error } = await supabase
    .from("product_collections")
    .insert(payload);

  if (error) throw error;
},
  async createProductTags(
    productId: string,
    tagIds: string[]
  ) {
    if (!tagIds.length) return;

    const payload = tagIds.map((tagId) => ({
      product_id: productId,
      tag_id: tagId,
    }));

    const { error } = await supabase
      .from("product_tags")
      .insert(payload);

    if (error) throw error;
  },
async replaceProductTags(
  productId: string,
  tagIds: string[]
) {
  const { error: deleteError } = await supabase
    .from("product_tags")
    .delete()
    .eq("product_id", productId);

  if (deleteError) throw deleteError;

  if (!tagIds.length) return;

  const payload = tagIds.map((tagId) => ({
    product_id: productId,
    tag_id: tagId,
  }));

  const { error } = await supabase
    .from("product_tags")
    .insert(payload);

  if (error) throw error;
},
  async update(
    id: string,
    data: ProductFormData
  ) {
    const { data: product, error } =
      await supabase
        .from(TABLE)
        .update(data)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return product as Product;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};