import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface CollectionOption {
  id: string;
  name: string;
  slug: string;
  banner_image: string | null;
  thumbnail_image: string | null;
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections-options"],

    queryFn: async (): Promise<CollectionOption[]> => {
      const { data, error } = await supabase
        .from("collections")
        .select("id,name,slug,banner_image,thumbnail_image")
        .order("name");

      if (error) throw error;

      return data ?? [];
    },
  });
}