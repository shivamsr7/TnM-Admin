export interface Subcategory {
  id: string;

  category_id: string;

  name: string;

  slug: string | null;

  description: string | null;

  image_url: string | null;

  sort_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}