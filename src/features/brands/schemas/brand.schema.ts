import { z } from "zod";

export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters.")
    .max(100, "Brand name cannot exceed 100 characters."),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens."
    ),

  logo_url: z
    .string()
    .url("Please enter a valid logo URL.")
    .or(z.literal(""))
    .nullable()
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),

  website: z
    .string()
    .url("Please enter a valid website URL.")
    .or(z.literal(""))
    .optional(),

  is_active: z.boolean().default(true),
});

export type BrandSchema = z.infer<typeof brandSchema>;