import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),

  slug: z.string().min(2),

  category_id: z.string().min(1, "Category is required"),

  brand_id: z.string().nullable().optional(),

  short_description: z.string().optional(),

  description: z.string().optional(),

  care_instructions: z.string().optional(),

  cost_price: z.number().nullable().optional(),

  price: z.number().min(1, "Price is required"),

  compare_price: z.number().nullable().optional(),

  sku: z.string().optional(),

  barcode: z.string().optional(),

  stock: z.number().default(0),

  low_stock_threshold: z.number().default(5),

  track_inventory: z.boolean().default(true),

  allow_backorders: z.boolean().default(false),

  status: z.enum([
    "draft",
    "active",
    "hidden",
    "archived",
    "out_of_stock",
  ]),

  trending: z.boolean().default(false),

  editors_pick: z.boolean().default(false),

  seo_title: z.string().optional(),

  seo_description: z.string().optional(),

  meta_keywords: z.string().optional(),

collection_ids: z.array(z.string()).default([]),

tag_ids: z.array(z.string()).default([]),

featured: z.boolean().default(false),

new_arrival: z.boolean().default(false),

best_seller: z.boolean().default(false),
});

export type ProductSchema = z.infer<typeof productSchema>;