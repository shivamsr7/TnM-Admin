import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tag name is required"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required"),

  description: z.string(),

  is_active: z.boolean(),

  sort_order: z
    .number()
    .min(0, "Sort order must be 0 or greater"),
});

export type TagSchema = z.infer<typeof tagSchema>;