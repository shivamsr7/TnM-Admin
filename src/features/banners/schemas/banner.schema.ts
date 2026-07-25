import { z } from "zod";

export const bannerSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters"),

  subtitle: z.string(),

  image_url: z
    .string()
    .min(1, "Banner image is required"),

  image_path: z
    .string()
    .min(1, "Banner image path is required"),

  mobile_image_url: z.string(),

  mobile_image_path: z.string(),

  button_text: z.string(),

  button_link: z.string(),

  position: z.enum([
    "Homepage Hero",
    "Homepage Secondary",
    "Collection Banner",
    "Sale Banner",
    "Offer Strip",
    "Popup",
  ]),

  display_order: z
    .number()
    .min(0, "Display order cannot be negative"),

  starts_at: z.string().nullable(),

  ends_at: z.string().nullable(),

  is_active: z.boolean(),
});

export type BannerSchema = z.infer<typeof bannerSchema>;