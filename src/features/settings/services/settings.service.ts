import { supabase } from "@/lib/supabase";

import type { StoreSettings } from "../types/settings.types";
import type { StoreSettingsFormValues } from "../schemas/settings.schema";

class SettingsService {
  async get(): Promise<StoreSettings> {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .single();

    if (error) throw error;

    return {
      id: data.id,

      storeName: data.store_name,
      storeDescription: data.store_description,

      currency: data.currency,
      currencySymbol: data.currency_symbol,
      timezone: data.timezone,
      language: data.language,
      dateFormat: data.date_format,
      timeFormat: data.time_format,

      logo: data.logo,
      favicon: data.favicon,

      supportEmail: data.support_email,
      businessEmail: data.business_email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      address: data.address,

      instagram: data.instagram,
      facebook: data.facebook,
      youtube: data.youtube,
      pinterest: data.pinterest,
      twitter: data.twitter,
      linkedin: data.linkedin,

      freeShippingThreshold: data.free_shipping_threshold,
      freeGiftThreshold: data.free_gift_threshold,
      shippingCharge: data.shipping_charge,
      codEnabled: data.cod_enabled,
deliveryTime: data.delivery_time,
shippingNote: data.shipping_note,

partialCodEnabled: data.partial_cod_enabled,
partialCodAmount: data.partial_cod_amount,
partialCodMinOrder: data.partial_cod_min_order,
// Payment
razorpayEnabled: data.razorpay_enabled,

codAvailable: data.cod_available,

razorpayMode: data.razorpay_mode,

razorpayKeyId: data.razorpay_key_id,

paymentSuccessMessage: data.payment_success_message,

paymentFailureMessage: data.payment_failure_message,

spinEnabled: data.spin_enabled,
showSpinCard: data.show_spin_card,
spinCooldownHours: data.spin_cooldown_hours,
spinMaintenanceMessage: data.spin_maintenance_message,
// SEO
seoTitle: data.seo_title,

seoDescription: data.seo_description,

seoKeywords: data.seo_keywords,

canonicalUrl: data.canonical_url,

robots: data.robots,

googleSiteVerification: data.google_site_verification,

bingSiteVerification: data.bing_site_verification,

defaultOgImage: data.default_og_image,

twitterCard: data.twitter_card,

      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async update(
  id: string,
  values: StoreSettingsFormValues
): Promise<void> {
    const { error } = await supabase
      .from("store_settings")
      .update({
  // Store Information
  store_name: values.storeName,
  store_description: values.storeDescription,

  // Regional
  currency: values.currency,
  currency_symbol: values.currencySymbol,
  timezone: values.timezone,
  language: values.language,
  date_format: values.dateFormat,
  time_format: values.timeFormat,

  // Branding
  logo: values.logo,
  favicon: values.favicon,

  // Contact
  support_email: values.supportEmail,
  business_email: values.businessEmail,
  phone: values.phone,
  whatsapp: values.whatsapp,
  address: values.address,

  // Social
  instagram: values.instagram,
  facebook: values.facebook,
  youtube: values.youtube,
  pinterest: values.pinterest,
  twitter: values.twitter,
  linkedin: values.linkedin,

// Shipping
free_shipping_threshold: values.freeShippingThreshold,
free_gift_threshold: values.freeGiftThreshold,
shipping_charge: values.shippingCharge,

delivery_time: values.deliveryTime,
shipping_note: values.shippingNote,

partial_cod_enabled: values.partialCodEnabled,
partial_cod_amount: values.partialCodAmount,
partial_cod_min_order: values.partialCodMinOrder,
// Payment
razorpay_enabled: values.razorpayEnabled,

cod_available: values.codAvailable,

razorpay_mode: values.razorpayMode,

razorpay_key_id: values.razorpayKeyId,

payment_success_message: values.paymentSuccessMessage,

payment_failure_message: values.paymentFailureMessage,

spin_enabled: values.spinEnabled,
show_spin_card: values.showSpinCard,
spin_cooldown_hours: values.spinCooldownHours,
spin_maintenance_message: values.spinMaintenanceMessage,
// SEO
seo_title: values.seoTitle,

seo_description: values.seoDescription,

seo_keywords: values.seoKeywords,

canonical_url: values.canonicalUrl,

robots: values.robots,

google_site_verification: values.googleSiteVerification,

bing_site_verification: values.bingSiteVerification,

default_og_image: values.defaultOgImage,

twitter_card: values.twitterCard,
})
      .eq("id", id);

    if (error) throw error;
  }
}

export const settingsService = new SettingsService();