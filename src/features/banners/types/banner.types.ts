export type BannerPosition =
  | "Homepage Hero"
  | "Homepage Secondary"
  | "Collection Banner"
  | "Sale Banner"
  | "Offer Strip"
  | "Popup";

export interface Banner {
  id: string;

  title: string;
  subtitle: string;

  image_url: string;
  image_path: string;

  mobile_image_url: string;
  mobile_image_path: string;

  button_text: string;
  button_link: string;

  position: BannerPosition;

  display_order: number;

  starts_at: string | null;
  ends_at: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface BannerFormData {
  title: string;
  subtitle: string;

  image_url: string;
  image_path: string;

  mobile_image_url: string;
  mobile_image_path: string;

  button_text: string;
  button_link: string;

  position: BannerPosition;

  display_order: number;

  starts_at: string | null;
  ends_at: string | null;

  is_active: boolean;
}