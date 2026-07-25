import { z } from "zod";


export const addressSchema = z.object({

  type: z.enum([
    "home",
    "office",
    "other",
  ]),


  full_name: z
    .string()
    .min(2, "Full name is required"),


  phone: z
    .string()
    .min(10, "Valid phone number is required")
    .max(15, "Phone number is too long"),


  address_line_1: z
    .string()
    .min(5, "Address is required"),


  address_line_2: z
    .string()
    .optional()
    .nullable(),


  city: z
    .string()
    .min(2, "City is required"),


  state: z
    .string()
    .min(2, "State is required"),


  postal_code: z
    .string()
    .min(4, "Postal code is required"),


  country: z
  .string()
  .default("India")
  .optional(),

is_default: z
  .boolean()
  .default(false)
  .optional(),

});


export type AddressSchema =
  z.infer<typeof addressSchema>;