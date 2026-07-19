import { z } from "zod";

export const collectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Collection name is required"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required"),

  description: z.string(),

  banner_image: z.string(),

  is_active: z.boolean(),

  sort_order: z
    .number()
    .min(0),
});

export type CollectionFormValues =
  z.infer<typeof collectionSchema>;