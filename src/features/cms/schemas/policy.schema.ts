import { z } from "zod";


export const policySchema = z.object({

  title: z
    .string()
    .min(3, "Title is required"),


  slug: z
    .string()
    .min(3, "Slug is required"),


  content: z
    .string()
    .min(10, "Content is required"),


  is_active: z.boolean(),

});


export type PolicySchema = z.infer<
  typeof policySchema
>;