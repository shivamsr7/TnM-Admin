import { z } from "zod";

export const bannerSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100),

  subtitle: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("")),

  buttonText: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("")),

  buttonLink: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal("")),

  desktopImage: z
    .string()
    .min(1, "Desktop banner image is required"),

  mobileImage: z
    .string()
    .optional()
    .or(z.literal("")),

  // ✅ Changed from z.coerce.number()
  displayOrder: z
    .number()
    .min(1, "Display order must be at least 1"),

  isActive: z.boolean(),
});

export type BannerFormValues = z.input<typeof bannerSchema>;