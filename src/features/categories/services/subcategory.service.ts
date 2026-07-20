import { supabase } from "@/lib/supabase";
import type { Subcategory } from "../types/subcategory.types";

export interface CreateSubcategoryData {
  category_id: string;
  name: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateSubcategoryData {
  name: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

export const subcategoryService = {
  async getByCategory(categoryId: string): Promise<Subcategory[]> {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return data ?? [];
  },

  async create(payload: CreateSubcategoryData): Promise<Subcategory> {
    const { data, error } = await supabase
      .from("subcategories")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    payload: UpdateSubcategoryData
  ): Promise<Subcategory> {
    const { data, error } = await supabase
      .from("subcategories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};