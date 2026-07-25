import { supabase } from "@/lib/supabase";

import type {
  HomepageSection,
  HomepageSectionFormValues,
} from "../types/section.types";

export const homepageSectionsService = {
  async getSections(): Promise<HomepageSection[]> {
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("display_order", {
        ascending: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as HomepageSection[];
  },

  async updateSection(
    id: string,
    values: HomepageSectionFormValues
  ) {
    const { error } = await supabase
      .from("homepage_sections")
      .update({
        title: values.title || null,
        subtitle: values.subtitle || null,
        is_enabled: values.is_enabled,
        settings: values.settings,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },

  async toggleSectionStatus(
    id: string,
    is_enabled: boolean
  ) {
    const { error } = await supabase
      .from("homepage_sections")
      .update({
        is_enabled,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },
};