import { supabase } from "@/lib/supabase";

import type {
  Collection,
  CollectionFormData,
} from "../types/collection.types";

class CollectionService {
  async getAll(): Promise<Collection[]> {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return data ?? [];
  }

  async getById(id: string): Promise<Collection> {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async create(values: CollectionFormData) {
    const { data, error } = await supabase
      .from("collections")
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async update(
    id: string,
    values: CollectionFormData
  ) {
    const { data, error } = await supabase
      .from("collections")
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

export const collectionService =
  new CollectionService();