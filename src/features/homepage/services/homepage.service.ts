import { supabase } from "@/lib/supabase";

import type { HomepageBanner } from "../types/homepage.types";
import type { BannerFormValues } from "../schemas/banner.schema";

export const homepageService = {
  async getBanners(): Promise<HomepageBanner[]> {
    const { data, error } = await supabase
      .from("homepage_banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return (data ?? []) as HomepageBanner[];
  },

  async createBanner(values: BannerFormValues) {
    const { data, error } = await supabase
      .from("homepage_banners")
      .insert({
        title: values.title,
        subtitle: values.subtitle || null,

        button_text: values.buttonText || null,
        button_link: values.buttonLink || null,

        desktop_image: values.desktopImage,
        mobile_image: values.mobileImage || null,

        is_active: values.isActive,
        display_order: values.displayOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateBanner(
    id: string,
    values: BannerFormValues
  ) {
    const { data, error } = await supabase
      .from("homepage_banners")
      .update({
        title: values.title,
        subtitle: values.subtitle || null,

        button_text: values.buttonText || null,
        button_link: values.buttonLink || null,

        desktop_image: values.desktopImage,
        mobile_image: values.mobileImage || null,

        is_active: values.isActive,
        display_order: values.displayOrder,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteBanner(id: string) {
    const { error } = await supabase
      .from("homepage_banners")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async toggleBannerStatus(
    id: string,
    isActive: boolean
  ) {
    const { error } = await supabase
      .from("homepage_banners")
      .update({
        is_active: isActive,
      })
      .eq("id", id);

    if (error) throw error;
  },
  async reorderBanners(
  banners: {
    id: string;
    display_order: number;
  }[]
) {

  const updates = banners.map(
    (banner) =>
      supabase
        .from("homepage_banners")
        .update({
          display_order:
            banner.display_order,
        })
        .eq(
          "id",
          banner.id
        )
  );


  const results =
    await Promise.all(updates);


  const error =
    results.find(
      (result) => result.error
    )?.error;


  if (error) {
    throw error;
  }

}
};