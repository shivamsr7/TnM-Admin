import { supabase } from "@/lib/supabase";

import type {
  Brand,
  BrandFormData,
} from "../types/brand.types";

const TABLE = "brands";

export const brandService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("name", {
        ascending: true,
      });

    if (error) throw error;

    return data as Brand[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as Brand;
  },

  async create(data: BrandFormData) {
    const { data: brand, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    return brand as Brand;
  },

  async update(
    id: string,
    data: BrandFormData
  ) {
    const { data: brand, error } = await supabase
      .from(TABLE)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return brand as Brand;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};