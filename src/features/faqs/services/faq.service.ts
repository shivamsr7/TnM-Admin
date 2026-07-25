import { supabase } from "@/lib/supabase";

import type {
  FAQ,
  FAQFormData,
} from "../types/faq.types";

const TABLE = "faqs";

export const faqService = {

  async getAll() {
    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .order("sort_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: false,
        });

    if (error) throw error;

    return data as FAQ[];
  },


  async getById(id: string) {
    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data as FAQ;
  },


  async create(payload: FAQFormData) {
    const { data, error } =
      await supabase
        .from(TABLE)
        .insert(payload)
        .select()
        .single();

    if (error) throw error;

    return data as FAQ;
  },


  async update(
    id: string,
    payload: FAQFormData
  ) {
    const { data, error } =
      await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data as FAQ;
  },


  async delete(id: string) {
    const { error } =
      await supabase
        .from(TABLE)
        .delete()
        .eq("id", id);

    if (error) throw error;
  },

};