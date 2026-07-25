import { z } from "zod";

export const notifyRequestSchema = z.object({
  product_id: z.string().uuid(),

  customer_id: z
    .string()
    .uuid()
    .nullable()
    .optional(),

  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(100),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(20),

  email: z
    .string()
    .trim()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "pending",
    "notified",
    "purchased",
    "cancelled",
  ]),
});

export type NotifyRequestSchema =
  z.infer<typeof notifyRequestSchema>;