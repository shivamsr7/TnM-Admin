import { supabase } from "@/lib/supabase";
import type {
  Banner,
  BannerFormData,
} from "../types/banner.types";

const TABLE = "banners";

export const bannerService = {
  async getAll(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  },

  async getById(id: string): Promise<Banner | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async create(values: BannerFormData): Promise<Banner> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    values: BannerFormData
  ): Promise<Banner> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(values)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id: string): Promise<void> {
  // Get banner first so we know which files to delete
  const { data: banner, error: fetchError } = await supabase
    .from(TABLE)
    .select("image_path, mobile_image_path")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Delete database record
  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  // Delete storage files (don't fail if storage cleanup fails)
  const paths = [
    banner?.image_path,
    banner?.mobile_image_path,
  ].filter(Boolean) as string[];

  if (paths.length) {
    await Promise.allSettled(
      paths.map((path) => supabase.storage.from("media").remove([path]))
    );
  }
},
};