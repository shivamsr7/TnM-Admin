import { supabase } from "@/lib/supabase";

import type {
  Policy,
  PolicyFormData,
} from "../types/policy.types";


const TABLE = "cms_pages";


export const policyService = {


  async getAll() {

    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", {
          ascending: false,
        });


    if (error) throw error;


    return data as Policy[];

  },


  async getById(
    id: string
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .single();


    if (error) throw error;


    return data as Policy;

  },


  async getBySlug(
    slug: string
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .eq("slug", slug)
        .single();


    if (error) throw error;


    return data as Policy;

  },


  async create(
    payload: PolicyFormData
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .insert(payload)
        .select()
        .single();


    if (error) throw error;


    return data as Policy;

  },


  async update(
    id: string,
    payload: PolicyFormData
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select()
        .single();


    if (error) throw error;


    return data as Policy;

  },


  async delete(
    id: string
  ) {

    const { error } =
      await supabase
        .from(TABLE)
        .delete()
        .eq("id", id);


    if (error) throw error;

  },

};