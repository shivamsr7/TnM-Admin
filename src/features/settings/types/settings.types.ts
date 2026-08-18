export interface StoreSettings {
  id: string;

  // Store Information
  storeName: string;
  storeDescription: string | null;

  // Regional
  currency: string;
  currencySymbol: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;

  // Branding
  logo: string | null;
  favicon: string | null;

  // Contact
  supportEmail: string | null;
  businessEmail: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;

  // Social
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  pinterest: string | null;
  twitter: string | null;
  linkedin: string | null;

  // Shipping
  freeShippingThreshold: number | null;
  freeGiftThreshold: number | null;
  shippingCharge: number | null;
  codEnabled: boolean;
deliveryTime: string;
shippingNote: string;
partialCodEnabled: boolean;
partialCodAmount: number | null;
partialCodMinOrder: number | null;
  // Payment
  razorpayEnabled: boolean;
  codAvailable: boolean;
razorpayMode: "test" | "live";

razorpayKeyId: string;

paymentSuccessMessage: string;

paymentFailureMessage: string;

// Spin Wheel
spinEnabled: boolean;

showSpinCard: boolean;

spinCooldownHours: number;

spinMaintenanceMessage: string;

// SEO
seoTitle: string;
seoDescription: string;
seoKeywords: string;
canonicalUrl: string;
robots: string;

googleSiteVerification: string;
bingSiteVerification: string;

defaultOgImage: string;
twitterCard: "summary" | "summary_large_image";

  createdAt: string;
  updatedAt: string;
}