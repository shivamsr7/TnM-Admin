import { z } from "zod";

export const heroSettingsSchema = z.object({
  autoplay: z.boolean(),

  autoplay_speed: z
    .number()
    .min(1000, "Minimum 1000ms")
    .max(30000, "Maximum 30000ms"),

  transition_duration: z
    .number()
    .min(100, "Minimum 100ms")
    .max(5000, "Maximum 5000ms"),

  pause_on_hover: z.boolean(),

  enable_swipe: z.boolean(),

  show_arrows: z.boolean(),

  show_dots: z.boolean(),

  show_progress: z.boolean(),

  transition_type: z.enum([
    "fade",
    "slide",
    "zoom",
  ]),
});

export type HeroSettingsSchema = z.infer<
  typeof heroSettingsSchema
>;