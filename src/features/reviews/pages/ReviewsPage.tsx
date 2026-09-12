import {
  Loader2,
  MessageSquare,
  WalletCards,
  Save,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import ReviewStats from "../components/ReviewStats";
import ReviewTable from "../components/ReviewTable";

import {
  useReviews,
  useReviewStats,
} from "../hooks/useReviews";

import {
  reviewWalletRewardSettingsService,
} from "../services/reviewWalletRewardSettings.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Switch,
} from "@/components/ui/switch";

export default function ReviewsPage() {

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useReviews();

  const {
    data: stats,
    isLoading: statsLoading,
  } = useReviewStats();

  type ReviewWalletRewardForm = {
    enabled: boolean;
    textReward: number;
    imageReward: number;
    videoReward: number;
    rewardExpiryDays: number;
  };

  const [
    settings,
    setSettings,
  ] = useState<ReviewWalletRewardForm | null>(
    null
  );

  const [
    settingsLoading,
    setSettingsLoading,
  ] = useState(true);

  const [
    settingsSaving,
    setSettingsSaving,
  ] = useState(false);


  /*
   * =========================================================
   * LOAD SETTINGS
   * =========================================================
   */

  useEffect(() => {

    let mounted = true;

    const loadSettings = async () => {

      try {

        setSettingsLoading(true);

        const data =
          await reviewWalletRewardSettingsService.get();

        if (mounted) {

          setSettings({
            enabled:
              data.enabled,

            textReward:
              Number(
                data.text_reward_paise
              ) / 100,

            imageReward:
              Number(
                data.image_reward_paise
              ) / 100,

            videoReward:
              Number(
                data.video_reward_paise
              ) / 100,

            rewardExpiryDays:
              Number(
                data.reward_expiry_days ??
                365
              ),
          });

        }

      } catch (error) {

        console.error(
          "Failed to load review wallet reward settings:",
          error
        );

        if (mounted) {

          toast.error(
            "Failed to load review reward settings."
          );

        }

      } finally {

        if (mounted) {
          setSettingsLoading(false);
        }

      }

    };

    loadSettings();

    return () => {
      mounted = false;
    };

  }, []);


  /*
   * =========================================================
   * SAVE SETTINGS
   * =========================================================
   */

  const saveSettings = async () => {

    if (!settings) {
      return;
    }

    const textReward =
      Number(settings.textReward);

    const imageReward =
      Number(settings.imageReward);

    const videoReward =
      Number(settings.videoReward);

    const rewardExpiryDays =
      Number(settings.rewardExpiryDays);


    if (
      !Number.isFinite(textReward) ||
      textReward < 0
    ) {
      toast.error(
        "Enter a valid Text Review reward."
      );
      return;
    }


    if (
      !Number.isFinite(imageReward) ||
      imageReward < 0
    ) {
      toast.error(
        "Enter a valid Image Review reward."
      );
      return;
    }


    if (
      !Number.isFinite(videoReward) ||
      videoReward < 0
    ) {
      toast.error(
        "Enter a valid Video Review reward."
      );
      return;
    }


    if (
      !Number.isFinite(rewardExpiryDays) ||
      rewardExpiryDays < 0 ||
      !Number.isInteger(rewardExpiryDays)
    ) {
      toast.error(
        "Reward expiry must be a whole number of days."
      );
      return;
    }


    try {

      setSettingsSaving(true);

      const updated =
        await reviewWalletRewardSettingsService.update({

          enabled:
            settings.enabled,

          text_reward_paise:
            Math.round(
              textReward * 100
            ),

          image_reward_paise:
            Math.round(
              imageReward * 100
            ),

          video_reward_paise:
            Math.round(
              videoReward * 100
            ),

          reward_expiry_days:
            rewardExpiryDays,

        });


      setSettings({

        enabled:
          updated.enabled,

        textReward:
          Number(
            updated.text_reward_paise
          ) / 100,

        imageReward:
          Number(
            updated.image_reward_paise
          ) / 100,

        videoReward:
          Number(
            updated.video_reward_paise
          ) / 100,

        rewardExpiryDays:
          Number(
            updated.reward_expiry_days
          ),

      });


      toast.success(
        "Review reward settings saved."
      );

    } catch (error) {

      console.error(
        "Failed to save review wallet reward settings:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save review reward settings."
      );

    } finally {

      setSettingsSaving(false);

    }

  };


  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (
    reviewsLoading ||
    statsLoading ||
    settingsLoading
  ) {

    return (
      <div className="flex h-[60vh] items-center justify-center">

        <Loader2
          className="
            h-8
            w-8
            animate-spin
            text-primary
          "
        />

      </div>
    );

  }


  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (reviewsError) {

    return (
      <div
        className="
          flex
          h-[60vh]
          flex-col
          items-center
          justify-center
          gap-3
        "
      >

        <MessageSquare
          className="
            h-10
            w-10
            text-red-500
          "
        />

        <h2 className="text-xl font-semibold">
          Failed to load reviews
        </h2>

        <p className="text-muted-foreground">
          Please refresh the page and try again.
        </p>

      </div>
    );

  }


  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const textRewardRupees =
    settings?.textReward ?? 5;

  const imageRewardRupees =
    settings?.imageReward ?? 10;

  const videoRewardRupees =
    settings?.videoReward ?? 20;

  const rewardExpiryDays =
    settings?.rewardExpiryDays ?? 365;


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (

    <div className="space-y-6">

      <div>

        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
          "
        >
          Reviews
        </h1>

        <p className="text-muted-foreground">
          Manage customer reviews and ratings.
        </p>

      </div>


      {/* =====================================================
          REVIEW WALLET REWARD SETTINGS
      ====================================================== */}

      {settings && (

        <div
          className="
            rounded-xl
            border
            bg-card
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-start
              lg:justify-between
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                "
              >

                <WalletCards
                  className="
                    h-5
                    w-5
                  "
                />

              </div>

              <div>

                <h2 className="font-semibold">
                  Review Wallet Rewards
                </h2>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Configure wallet rewards given
                  when customer reviews are approved.
                </p>

              </div>

            </div>


            {/* ENABLE SWITCH */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                rounded-lg
                border
                px-4
                py-3
              "
            >

              <div>

                <p className="text-sm font-medium">
                  Enable Wallet Rewards
                </p>

                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  {settings.enabled
                    ? "Rewards are active."
                    : "Reviews will be approved without wallet rewards."}
                </p>

              </div>

              <Switch
                checked={
                  settings.enabled
                }
                onCheckedChange={(
                  checked
                ) =>
                  setSettings({
                    ...settings,
                    enabled: checked,
                  })
                }
              />

            </div>

          </div>


          {/* REWARD AMOUNTS */}

          <div
            className="
              mt-5
              grid
              gap-4
              md:grid-cols-3
            "
          >

            {/* TEXT */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                "
              >
                Text Review Reward (₹)
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-sm
                    text-muted-foreground
                  "
                >
                  ₹
                </span>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    textRewardRupees
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      textReward:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                  className="pl-8"
                />

              </div>

            </div>


            {/* IMAGE */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                "
              >
                Image Review Reward (₹)
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-sm
                    text-muted-foreground
                  "
                >
                  ₹
                </span>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    imageRewardRupees
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      imageReward:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                  className="pl-8"
                />

              </div>

            </div>


            {/* VIDEO */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                "
              >
                Video Review Reward (₹)
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-sm
                    text-muted-foreground
                  "
                >
                  ₹
                </span>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    videoRewardRupees
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      videoReward:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                  className="pl-8"
                />

              </div>

            </div>

          </div>


          {/* =================================================
              EXPIRY
          ================================================== */}

          <div
            className="
              mt-4
              max-w-sm
              space-y-2
            "
          >

            <label
              className="
                text-sm
                font-medium
              "
            >
              Review Reward Credit Expiry
            </label>

            <div className="relative">

              <Input
                type="number"
                min="0"
                step="1"
                value={
                  rewardExpiryDays
                }
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    rewardExpiryDays:
                      Number(
                        e.target.value
                      ),
                  })
                }
                className="pr-16"
              />

              <span
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-sm
                  text-muted-foreground
                "
              >
                days
              </span>

            </div>

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Set to 0 for rewards that never expire.
            </p>

          </div>


          {/* SAVE */}

          <div
            className="
              mt-5
              flex
              justify-end
            "
          >

            <Button
              onClick={
                saveSettings
              }
              disabled={
                settingsSaving
              }
            >

              {settingsSaving ? (

                <Loader2
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                />

              ) : (

                <Save
                  className="
                    mr-2
                    h-4
                    w-4
                  "
                />

              )}

              Save Settings

            </Button>

          </div>

        </div>

      )}


      {/* STATS */}

      {stats && (
        <ReviewStats
          stats={stats}
        />
      )}


      {/* REVIEWS */}

      <ReviewTable
        reviews={reviews}
        reviewRewardSettings={
          settings
            ? {
                enabled:
                  settings.enabled,

                textReward:
                  textRewardRupees,

                imageReward:
                  imageRewardRupees,

                videoReward:
                  videoRewardRupees,
              }
            : undefined
        }
      />

    </div>
  );
}