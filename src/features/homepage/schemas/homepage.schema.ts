import { z } from "zod";

export const homepageBannerSchema = z.object({
  title: z.string().min(2, "Title is required"),

  subtitle: z.string().default(""),

  buttonText: z.string().default(""),

  buttonLink: z.string().default(""),

  desktopImage: z.string().min(1, "Desktop image is required"),

  mobileImage: z.string().default(""),

  isActive: z.boolean().default(true),

  displayOrder: z.number().default(1),
});

export type HomepageBannerFormValues =
  z.input<typeof homepageBannerSchema>;