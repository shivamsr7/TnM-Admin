export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
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
  sort_order?: number;
  is_active?: boolean;
}