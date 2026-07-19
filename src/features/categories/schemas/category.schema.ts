import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name is required"),

  slug: z
    .string()
    .min(2, "Slug is required"),

  description: z.string().optional(),

  parent_id: z.string().nullable().optional(),

  sort_order: z.number().default(0),

  is_active: z.boolean().default(true),
});

export type CategorySchema = z.infer<
  typeof categorySchema
>;