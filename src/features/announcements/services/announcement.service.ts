import { supabase } from "@/lib/supabase";
import type {
  Announcement,
  AnnouncementInput,
} from "../types/announcements.types";

export const announcementService = {
  async getAll(): Promise<Announcement[]> {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return data ?? [];
  },

  async create(
    announcement: AnnouncementInput
  ): Promise<Announcement> {
    const { data, error } = await supabase
      .from("announcements")
      .insert(announcement)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    announcement: AnnouncementInput
  ): Promise<Announcement> {
    const { data, error } = await supabase
      .from("announcements")
      .update({
        ...announcement,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async toggleStatus(
    id: string,
    is_active: boolean
  ): Promise<void> {
    const { error } = await supabase
      .from("announcements")
      .update({
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },
};