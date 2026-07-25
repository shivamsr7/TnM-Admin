export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  description?: string;

  image_url?: string | null;

  sort_order: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;

  image_url?: string | null;

  sort_order?: number;
  is_active?: boolean;
}