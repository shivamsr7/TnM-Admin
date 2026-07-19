export interface Collection {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  banner_image: string | null;

  is_active: boolean;

  sort_order: number;

  created_at: string;

  updated_at: string;
}

export interface CollectionFormData {
  name: string;

  slug: string;

  description: string;

  banner_image: string;

  is_active: boolean;

  sort_order: number;
}