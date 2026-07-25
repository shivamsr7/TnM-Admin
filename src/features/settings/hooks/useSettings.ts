import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";
import { mapStoreSettingsToFormValues } from "../utils/settings.mapper";
import {
  storeSettingsSchema,
  type StoreSettingsFormValues,
} from "../schemas/settings.schema";

import { settingsService } from "../services/settings.service";


export function useGeneralSettings() {
  const queryClient = useQueryClient();

  const form = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),

   defaultValues: {
  storeName: "",
  storeDescription: "",

  currency: "INR",
  currencySymbol: "₹",
  timezone: "Asia/Kolkata",
  language: "English",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12 Hours",

  logo: null,
  favicon: null,

  supportEmail: "",
  businessEmail: "",
  phone: "",
  whatsapp: "",
  address: "",

  instagram: "",
  facebook: "",
  youtube: "",
  pinterest: "",
  twitter: "",
  linkedin: "",

  freeShippingThreshold: null,
  shippingCharge: null,
  codEnabled: true,
deliveryTime: "",

shippingNote: "",

partialCodEnabled: false,

partialCodAmount: null,
partialCodMinOrder: null,
// Payment
razorpayEnabled: true,

codAvailable: false,

razorpayMode: "test",

razorpayKeyId: "",

paymentSuccessMessage:
  "Payment completed successfully.",

paymentFailureMessage:
  "Payment failed. Please try again.",

// SEO
seoTitle: "",

seoDescription: "",

seoKeywords: "",

canonicalUrl: "",

robots: "index,follow",

googleSiteVerification: "",

bingSiteVerification: "",

defaultOgImage: "",

twitterCard: "summary_large_image",
},
  });

  const settingsQuery = useQuery({
    queryKey: ["store-settings"],
    queryFn: () => settingsService.get(),
  });

  useEffect(() => {
    if (!settingsQuery.data) return;

    form.reset(
  mapStoreSettingsToFormValues(settingsQuery.data)
);
  }, [settingsQuery.data, form]);

const updateMutation = useMutation({
  mutationFn: async (values: StoreSettingsFormValues) => {
    if (!settingsQuery.data) {
      throw new Error("Settings not loaded.");
    }

    await settingsService.update(settingsQuery.data.id, values);
  },

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["store-settings"],
    });

    form.reset(form.getValues());

    toast.success("Settings updated successfully.");
  },

  onError: (error: Error) => {
    toast.error(error.message);
  },
});

  return {
    form,

    settingsQuery,

    updateMutation,
  };
}