import { supabase } from "@/lib/supabase";
import type {
  Category,
  CategoryFormData,
} from "../types/category.types";

const TABLE = "categories";

export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return data as Category[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as Category;
  },

  async create(payload: CategoryFormData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data as Category;
  },

  async update(id: string, payload: CategoryFormData) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data as Category;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};