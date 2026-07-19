export interface Brand {
  id: string;

  name: string;
  slug: string;

  logo_url: string | null;

  description: string | null;

  website: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface BrandFormData {
  name: string;
  slug: string;

  logo_url?: string | null;

  description?: string;

  website?: string;

  is_active?: boolean;
}