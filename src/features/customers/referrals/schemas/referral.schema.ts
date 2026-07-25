import { z } from "zod";


export const referralSchema = z.object({

  referral_code: z
    .string()
    .min(
      3,
      "Referral code is required"
    ),


  referred_by: z
    .string()
    .uuid()
    .nullable()
    .optional(),

});


export type ReferralSchema =
  z.infer<typeof referralSchema>;