import { z } from "zod";

export const storeSettingsSchema = z.object({
  // Store Information
  storeName: z.string().min(2, "Store name is required"),
  storeDescription: z.string().optional(),

  // Regional
  currency: z.string().min(1),
  currencySymbol: z.string().min(1),
  timezone: z.string().min(1),
  language: z.string().min(1),
  dateFormat: z.string().min(1),
  timeFormat: z.string().min(1),

  // Branding
  logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),

  // Contact
  supportEmail: z.string().email().optional().or(z.literal("")),
  businessEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),

  // Social
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  pinterest: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),

  // Shipping
  freeShippingThreshold: z.number().nullable(),
  shippingCharge: z.number().nullable(),
  codEnabled: z.boolean(),
deliveryTime: z.string().default(""),

shippingNote: z.string().default(""),

partialCodEnabled: z.boolean().default(false),

partialCodAmount: z
  .number()
  .nullable()
  .default(null),
  partialCodMinOrder: z
  .number()
  .nullable()
  .default(null),
// Payment
razorpayEnabled: z.boolean().default(true),

codAvailable: z.boolean().default(false),

razorpayMode: z
  .enum(["test", "live"])
  .default("test"),

razorpayKeyId: z.string().default(""),

paymentSuccessMessage: z
  .string()
  .default("Payment completed successfully."),

paymentFailureMessage: z
  .string()
  .default("Payment failed. Please try again."),

  // Spin Wheel
spinEnabled: z.boolean().default(true),

showSpinCard: z.boolean().default(true),

spinCooldownHours: z
  .number()
  .min(1)
  .max(168)
  .default(24),

spinMaintenanceMessage: z
  .string()
  .default(
    "The Spin Wheel is temporarily unavailable."
  ),
// SEO
seoTitle: z.string().default(""),

seoDescription: z.string().default(""),

seoKeywords: z.string().default(""),

canonicalUrl: z.string().default(""),

robots: z.string().default("index,follow"),

googleSiteVerification: z.string().default(""),

bingSiteVerification: z.string().default(""),

defaultOgImage: z.string().default(""),

twitterCard: z
  .enum(["summary", "summary_large_image"])
  .default("summary_large_image"),
});

export type StoreSettingsFormValues =
  z.input<typeof storeSettingsSchema>;