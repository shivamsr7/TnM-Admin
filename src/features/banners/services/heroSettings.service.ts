import { supabase } from "@/lib/supabase";

import type {
  HeroSettings,
  HeroSettingsFormData,
} from "../types/heroSettings.types";

const TABLE = "hero_settings";

export const heroSettingsService = {
  async get(): Promise<HeroSettings> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    values: HeroSettingsFormData
  ): Promise<HeroSettings> {
    const { data: settings, error: fetchError } =
      await supabase
        .from(TABLE)
        .select("id")
        .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from(TABLE)
      .update(values)
      .eq("id", settings.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};