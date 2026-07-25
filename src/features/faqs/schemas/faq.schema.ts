import { z } from "zod";

export const faqSchema = z.object({

  question: z
    .string()
    .min(5, "Question is required"),

  answer: z
    .string()
    .min(5, "Answer is required"),

  sort_order: z.number(),

  is_active: z.boolean(),

});


export type FAQSchema = z.infer<
  typeof faqSchema
>;