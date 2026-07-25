export interface FAQ {
  id: string;

  question: string;

  answer: string;

  sort_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}


export interface FAQFormData {
  question: string;

  answer: string;

  sort_order?: number;

  is_active?: boolean;
}