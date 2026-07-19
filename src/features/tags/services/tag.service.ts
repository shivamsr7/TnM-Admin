import { supabase } from "@/lib/supabase";
import type {
  Tag,
  TagFormValues,
} from "../types/tag.types";

const TABLE = "tags";

export const tagService = {
  async getAll(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data ?? [];
  },

  async getById(id: string): Promise<Tag> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async create(values: TagFormValues) {
    const { error } = await supabase
      .from(TABLE)
      .insert(values);

    if (error) throw error;
  },

  async update(
    id: string,
    values: TagFormValues
  ) {
    const { error } = await supabase
      .from(TABLE)
      .update(values)
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};