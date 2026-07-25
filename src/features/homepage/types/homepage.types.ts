export interface HomepageBanner {
  id: string;

  title: string;
  subtitle: string | null;

  desktop_image: string | null;
  mobile_image: string | null;

  button_text: string | null;
  button_link: string | null;

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}