export interface Policy {
  id: string;

  slug: string;

  title: string;

  content: string;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}


export interface PolicyFormData {
  title: string;

  slug: string;

  content: string;

  is_active?: boolean;
}