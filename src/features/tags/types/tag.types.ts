export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TagFormValues {
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}