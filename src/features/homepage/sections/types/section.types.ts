import type { SectionFormValues } from "../schemas/section.schema";
export interface HomepageSection {
  id: string;

  section_key: string;

  title: string | null;

  subtitle: string | null;

  is_enabled: boolean;

  display_order: number;

  settings: Record<string, unknown>;

  created_at: string;

  updated_at: string;
}

export type HomepageSectionFormValues =
  SectionFormValues;