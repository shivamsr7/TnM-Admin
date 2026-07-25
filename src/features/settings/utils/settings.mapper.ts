import type { StoreSettingsFormValues } from "../schemas/settings.schema";
import type { StoreSettings } from "../types/settings.types";

export function mapStoreSettingsToFormValues(
  settings: StoreSettings
): StoreSettingsFormValues {
  return {
    // Store Information
    storeName: settings.storeName,
    storeDescription: settings.storeDescription ?? "",

    // Regional
    currency: settings.currency,
    currencySymbol: settings.currencySymbol,
    timezone: settings.timezone,
    language: settings.language,
    dateFormat: settings.dateFormat,
    timeFormat: settings.timeFormat,

    // Branding
    logo: settings.logo,
    favicon: settings.favicon,

    // Contact
    supportEmail: settings.supportEmail ?? "",
    businessEmail: settings.businessEmail ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    address: settings.address ?? "",

    // Social
    instagram: settings.instagram ?? "",
    facebook: settings.facebook ?? "",
    youtube: settings.youtube ?? "",
    pinterest: settings.pinterest ?? "",
    twitter: settings.twitter ?? "",
    linkedin: settings.linkedin ?? "",

    // Shipping
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingCharge: settings.shippingCharge,
    codEnabled: settings.codEnabled,

    deliveryTime: settings.deliveryTime ?? "",
    shippingNote: settings.shippingNote ?? "",

    partialCodEnabled: settings.partialCodEnabled,
    partialCodAmount: settings.partialCodAmount,
    partialCodMinOrder: settings.partialCodMinOrder,

    // Payment
    razorpayEnabled: settings.razorpayEnabled,
    codAvailable: settings.codAvailable,

    razorpayMode: settings.razorpayMode,

    razorpayKeyId: settings.razorpayKeyId ?? "",

    paymentSuccessMessage:
      settings.paymentSuccessMessage ??
      "Payment completed successfully.",

    paymentFailureMessage:
      settings.paymentFailureMessage ??
      "Payment failed. Please try again.",

    // Spin Wheel
    spinEnabled: settings.spinEnabled ?? true,

    showSpinCard: settings.showSpinCard ?? true,

    spinCooldownHours:
      settings.spinCooldownHours ?? 24,

    spinMaintenanceMessage:
      settings.spinMaintenanceMessage ??
      "The Spin Wheel is temporarily unavailable.",

    // SEO
    seoTitle: settings.seoTitle ?? "",
    seoDescription: settings.seoDescription ?? "",
    seoKeywords: settings.seoKeywords ?? "",

    canonicalUrl: settings.canonicalUrl ?? "",

    robots: settings.robots,

    googleSiteVerification:
      settings.googleSiteVerification ?? "",

    bingSiteVerification:
      settings.bingSiteVerification ?? "",

    defaultOgImage:
      settings.defaultOgImage ?? "",

    twitterCard: settings.twitterCard,
  };
}