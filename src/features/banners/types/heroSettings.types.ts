export interface HeroSettings {
  id: string;

  autoplay: boolean;
  autoplay_speed: number;
  transition_duration: number;

  pause_on_hover: boolean;
  enable_swipe: boolean;

  show_arrows: boolean;
  show_dots: boolean;
  show_progress: boolean;

  transition_type: TransitionType;

  created_at: string;
  updated_at: string;
}

export type TransitionType =
  | "fade"
  | "slide"
  | "zoom";

export type HeroSettingsFormData = Omit<
  HeroSettings,
  "id" | "created_at" | "updated_at"
>;