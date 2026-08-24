import {
  useEffect,
  useState,
} from "react";

import {
  Gift,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Switch,
} from "@/components/ui/switch";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  Button,
} from "@/components/ui/button";

import {
  toast,
} from "sonner";

import {
  supabase,
} from "@/lib/supabase";

import SettingCard from "../components/SettingCard";


interface GiftWrapSettings {
  id: string;
  enabled: boolean;
  price: number;
  gift_message_enabled: boolean;
  max_message_length: number;
  title: string;
  description: string;
}


const DEFAULT_SETTINGS: Omit<
  GiftWrapSettings,
  "id"
> = {
  enabled: true,
  price: 49,
  gift_message_enabled: true,
  max_message_length: 180,
  title: "Make it gift-ready",
  description:
    "Premium gift wrapping for your order",
};


export default function GiftWrapSection() {

  const [
    settings,
    setSettings,
  ] = useState<GiftWrapSettings | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  useEffect(() => {

    let cancelled = false;


    async function load() {

      setLoading(true);


      const {
        data,
        error,
      } = await supabase
        .from(
          "gift_wrap_settings"
        )
        .select("*")
        .limit(1)
        .maybeSingle();


      if (
        cancelled
      ) {

        return;

      }


      if (error) {

        console.error(
          "Failed to load Gift Wrap settings:",
          error
        );

        toast.error(
          "Unable to load Gift Wrap settings."
        );

        setSettings({
          id: "",
          ...DEFAULT_SETTINGS,
        });

        setLoading(false);

        return;

      }


      if (!data) {

        setSettings({
          id: "",
          ...DEFAULT_SETTINGS,
        });

      } else {

        setSettings({
          id:
            data.id,

          enabled:
            Boolean(
              data.enabled
            ),

          price:
            Number(
              data.price ??
              49
            ),

          gift_message_enabled:
            Boolean(
              data.gift_message_enabled
            ),

          max_message_length:
            Number(
              data.max_message_length ??
              180
            ),

          title:
            data.title ??
            DEFAULT_SETTINGS.title,

          description:
            data.description ??
            DEFAULT_SETTINGS.description,

        });

      }


      setLoading(false);

    }


    load();


    return () => {

      cancelled = true;

    };

  }, []);


  async function saveSettings() {

    if (
      !settings
    ) {

      return;

    }


    if (
      settings.price <
      0
    ) {

      toast.error(
        "Gift Wrap price cannot be negative."
      );

      return;

    }


    if (
      settings.max_message_length <
        1 ||
      settings.max_message_length >
        1000
    ) {

      toast.error(
        "Message length must be between 1 and 1000."
      );

      return;

    }


    if (
      !settings.title.trim()
    ) {

      toast.error(
        "Gift Wrap title is required."
      );

      return;

    }


    if (
      !settings.description.trim()
    ) {

      toast.error(
        "Gift Wrap description is required."
      );

      return;

    }


    setSaving(true);


    try {

      const payload = {

        enabled:
          settings.enabled,

        price:
          Number(
            settings.price
          ),

        gift_message_enabled:
          settings.gift_message_enabled,

        max_message_length:
          Number(
            settings.max_message_length
          ),

        title:
          settings.title.trim(),

        description:
          settings.description.trim(),

      };


      let error;


      if (
        settings.id
      ) {

        const result =
          await supabase
            .from(
              "gift_wrap_settings"
            )
            .update(
              payload
            )
            .eq(
              "id",
              settings.id
            );

        error =
          result.error;

      } else {

        const result =
          await supabase
            .from(
              "gift_wrap_settings"
            )
            .insert(
              payload
            );

        error =
          result.error;

      }


      if (
        error
      ) {

        throw error;

      }


      toast.success(
        "Gift Wrap settings updated."
      );

    } catch (
      error
    ) {

      console.error(
        "Failed to save Gift Wrap settings:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save Gift Wrap settings."
      );

    } finally {

      setSaving(false);

    }

  }


  function update(
    patch: Partial<GiftWrapSettings>
  ) {

    setSettings(
      current =>
        current
          ? {
              ...current,
              ...patch,
            }
          : current
    );

  }


  if (
    loading
  ) {

    return (

      <SettingCard
        title="Gift Wrap"
        description="Configure premium gift wrapping for your customers."
      >

        <div
          className="
            flex
            min-h-[220px]
            items-center
            justify-center
            text-sm
            text-slate-500
          "
        >

          <Loader2
            size={20}
            className="
              mr-2
              animate-spin
            "
          />

          Loading Gift Wrap settings...

        </div>

      </SettingCard>

    );

  }


  if (
    !settings
  ) {

    return null;

  }


  return (

    <div
      className="
        space-y-6
      "
    >

      <SettingCard
        title="Gift Wrap"
        description="Control the gift-wrapping experience shown in your cart."
      >

        {/* Hero */}

        <div
          className="
            rounded-2xl
            border
            border-[#C8A44D]/25
            bg-gradient-to-br
            from-[#fffdf7]
            via-white
            to-[#faf4df]
            p-5
            sm:p-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#C8A44D]
                  text-white
                  shadow-[0_8px_24px_rgba(200,164,77,0.25)]
                "
              >

                <Gift
                  size={27}
                  strokeWidth={1.8}
                />

              </div>


              <div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <h3
                    className="
                      text-base
                      font-semibold
                      text-slate-900
                    "
                  >
                    Gift Wrap
                  </h3>

                  <Sparkles
                    size={14}
                    className="
                      text-[#B18A25]
                    "
                  />

                </div>


                <p
                  className="
                    mt-1
                    max-w-xl
                    text-sm
                    leading-5
                    text-slate-500
                  "
                >
                  Offer premium wrapping as an optional add-on
                  during checkout.
                </p>

              </div>

            </div>


            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                rounded-xl
                border
                bg-white/80
                px-4
                py-3
                sm:min-w-[190px]
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-500
                  "
                >
                  Gift Wrap
                </p>

                <p
                  className="
                    mt-0.5
                    text-sm
                    font-semibold
                    text-slate-900
                  "
                >
                  {
                    settings.enabled
                      ? "Available"
                      : "Disabled"
                  }
                </p>

              </div>


              <Switch
                checked={
                  settings.enabled
                }
                onCheckedChange={(
                  enabled
                ) =>
                  update({
                    enabled,
                  })
                }
              />

            </div>

          </div>

        </div>


        {/* Main settings */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
          "
        >

          <div
            className="
              space-y-2
            "
          >

            <Label
              htmlFor="giftWrapPrice"
            >
              Gift Wrap Price (₹)
            </Label>


            <Input
              id="giftWrapPrice"
              type="number"
              min="0"
              step="0.01"
              value={
                settings.price
              }
              onChange={event =>
                update({
                  price:
                    Number(
                      event.target.value
                    ),
                })
              }
            />


            <p
              className="
                text-xs
                text-slate-500
              "
            >
              This is the customer-facing gift-wrap charge.
            </p>

          </div>


          <div
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              bg-slate-50
              p-4
            "
          >

            <div>

              <Label>
                Gift Message
              </Label>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                Allow customers to add a personal note.
              </p>

            </div>


            <Switch
              checked={
                settings.gift_message_enabled
              }
              onCheckedChange={(
                enabled
              ) =>
                update({
                  gift_message_enabled:
                    enabled,
                })
              }
            />

          </div>


          <div
            className="
              space-y-2
            "
          >

            <Label
              htmlFor="giftWrapMaxMessage"
            >
              Maximum Gift Message Length
            </Label>


            <Input
              id="giftWrapMaxMessage"
              type="number"
              min="1"
              max="1000"
              value={
                settings.max_message_length
              }
              disabled={
                !settings.gift_message_enabled
              }
              onChange={event =>
                update({
                  max_message_length:
                    Number(
                      event.target.value
                    ),
                })
              }
            />


            <p
              className="
                text-xs
                text-slate-500
              "
            >
              Maximum characters customers can enter.
            </p>

          </div>

        </div>


        {/* Copy */}

        <div
          className="
            mt-6
            space-y-5
            rounded-xl
            border
            bg-slate-50/70
            p-5
          "
        >

          <div>

            <Label
              htmlFor="giftWrapTitle"
            >
              Gift Wrap Title
            </Label>


            <Input
              id="giftWrapTitle"
              value={
                settings.title
              }
              onChange={event =>
                update({
                  title:
                    event.target.value,
                })
              }
              placeholder="Make it gift-ready"
            />

          </div>


          <div>

            <Label
              htmlFor="giftWrapDescription"
            >
              Gift Wrap Description
            </Label>


            <Textarea
              id="giftWrapDescription"
              rows={3}
              value={
                settings.description
              }
              onChange={event =>
                update({
                  description:
                    event.target.value,
                })
              }
              placeholder="Premium gift wrapping for your order"
            />

          </div>

        </div>


        {/* Preview */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-dashed
            border-[#C8A44D]/40
            bg-[#fffdf7]
            p-5
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[#A27B16]
            "
          >
            Cart Preview
          </p>


          <div
            className="
              mt-3
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-[#C8A44D]/25
              bg-white
              p-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#C8A44D]/10
                text-[#A27B16]
              "
            >

              <Gift
                size={20}
                strokeWidth={1.8}
              />

            </div>


            <div
              className="
                min-w-0
                flex-1
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {
                  settings.title ||
                  DEFAULT_SETTINGS.title
                }
              </p>


              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                "
              >
                {
                  settings.description ||
                  DEFAULT_SETTINGS.description
                }
              </p>

            </div>


            <span
              className="
                shrink-0
                text-sm
                font-semibold
                text-[#9A761C]
              "
            >
              ₹
              {
                Number(
                  settings.price
                ).toFixed(0)
              }
            </span>

          </div>

        </div>


        {/* Save */}

        <div
          className="
            mt-6
            flex
            justify-end
            border-t
            pt-5
          "
        >

          <Button
            type="button"
            onClick={
              saveSettings
            }
            disabled={
              saving
            }
            className="
              min-w-[150px]
              gap-2
              bg-black
              text-white
              hover:bg-black/90
            "
          >

            {
              saving ? (

                <Loader2
                  size={16}
                  className="
                    animate-spin
                  "
                />

              ) : (

                <Save
                  size={16}
                />

              )
            }


            {
              saving
                ? "Saving..."
                : "Save Changes"
            }

          </Button>

        </div>

      </SettingCard>

    </div>

  );

}
