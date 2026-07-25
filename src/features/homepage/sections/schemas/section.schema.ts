import { z } from "zod";

export const sectionSchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, "Maximum 100 characters")
    .nullable()
    .optional(),

  subtitle: z
    .string()
    .trim()
    .max(200, "Maximum 200 characters")
    .nullable()
    .optional(),

  is_enabled: z.boolean(),

  settings: z
    .record(z.string(), z.unknown())
    .default({}),
});

export type SectionFormValues = z.infer<
  typeof sectionSchema
>;