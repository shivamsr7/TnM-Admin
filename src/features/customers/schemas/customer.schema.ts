import { z } from "zod";

export const customerSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name is too long."),

  last_name: z
    .string()
    .trim()
    .max(100, "Last name is too long.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(20, "Phone number is too long."),

  status: z.enum(["active", "blocked"]),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),
});

export type CustomerSchema = z.infer<typeof customerSchema>;