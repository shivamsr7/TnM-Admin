import { supabase } from "@/lib/supabase";

export interface ReviewWalletRewardSettings {
  id: string;
  enabled: boolean;
  text_reward_paise: number;
  image_reward_paise: number;
  video_reward_paise: number;
  reward_expiry_days: number;
  created_at: string;
  updated_at: string;
}

class ReviewWalletRewardSettingsService {
  async get(): Promise<ReviewWalletRewardSettings> {
    const { data, error } = await supabase.rpc(
      "admin_get_review_wallet_reward_settings"
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(
        "Review wallet reward settings not found."
      );
    }

    return data as ReviewWalletRewardSettings;
  }

  async update(
    values: {
      enabled: boolean;
      text_reward_paise: number;
      image_reward_paise: number;
      video_reward_paise: number;
      reward_expiry_days: number;
    }
  ): Promise<ReviewWalletRewardSettings> {
    const { data, error } = await supabase.rpc(
      "admin_update_review_wallet_reward_settings",
      {
        p_enabled: values.enabled,
        p_text_reward_paise:
          values.text_reward_paise,
        p_image_reward_paise:
          values.image_reward_paise,
        p_video_reward_paise:
          values.video_reward_paise,
        p_reward_expiry_days:
          values.reward_expiry_days,
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(
        "Failed to update review wallet reward settings."
      );
    }

    return data as ReviewWalletRewardSettings;
  }
}

export const reviewWalletRewardSettingsService =
  new ReviewWalletRewardSettingsService();