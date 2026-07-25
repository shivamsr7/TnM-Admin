import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  heroSettingsSchema,
  type HeroSettingsSchema,
} from "../schemas/heroSettings.schema";

import {
  useHeroSettings,
  useUpdateHeroSettings,
} from "../hooks/useHeroSettings";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
interface HeroSettingsFormProps {
  onSuccess?: () => void;
}

export default function HeroSettingsForm({
  onSuccess,
}: HeroSettingsFormProps) {
  const {
    data: settings,
    isLoading,
  } = useHeroSettings();

  const updateMutation =
    useUpdateHeroSettings();

  const form = useForm<HeroSettingsSchema>({
    resolver: zodResolver(heroSettingsSchema),

    defaultValues: {
      autoplay: true,

      autoplay_speed: 5000,

      transition_duration: 800,

      pause_on_hover: true,

      enable_swipe: true,

      show_arrows: true,

      show_dots: true,

      show_progress: true,

      transition_type: "fade",
    },
  });

  useEffect(() => {
    if (!settings) return;

    form.reset({
      autoplay: settings.autoplay,

      autoplay_speed:
        settings.autoplay_speed,

      transition_duration:
        settings.transition_duration,

      pause_on_hover:
        settings.pause_on_hover,

      enable_swipe:
        settings.enable_swipe,

      show_arrows:
        settings.show_arrows,

      show_dots:
        settings.show_dots,

      show_progress:
        settings.show_progress,

      transition_type:
        settings.transition_type,
    });
  }, [settings, form]);

  const submit = async (
    values: HeroSettingsSchema
  ) => {
    await updateMutation.mutateAsync(values);

form.reset(values);

onSuccess?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        Loading Hero Settings...
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="space-y-8"
    >
      {/* Part 2 starts here */}
      <Form {...form}>
  <div className="grid gap-8 lg:grid-cols-2">

    {/* LEFT COLUMN */}

    <div className="space-y-6 rounded-xl border p-6">

      <h3 className="text-lg font-semibold">
        Slider Behaviour
      </h3>

      <FormField
        control={form.control}
        name="autoplay"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div>
              <FormLabel>
                Enable Autoplay
              </FormLabel>

              <FormDescription>
                Automatically change slides.
              </FormDescription>
            </div>

            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="autoplay_speed"
        render={({ field }) => (
          <FormItem>

            <FormLabel>
              Autoplay Speed (ms)
            </FormLabel>

            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) =>
                  field.onChange(
                    Number(e.target.value)
                  )
                }
              />
            </FormControl>

            <FormMessage />

          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transition_duration"
        render={({ field }) => (
          <FormItem>

            <FormLabel>
              Transition Duration (ms)
            </FormLabel>

            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) =>
                  field.onChange(
                    Number(e.target.value)
                  )
                }
              />
            </FormControl>

            <FormMessage />

          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transition_type"
        render={({ field }) => (
          <FormItem>

            <FormLabel>
              Transition Type
            </FormLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>

                <SelectTrigger>

                  <SelectValue />

                </SelectTrigger>

              </FormControl>

              <SelectContent>

                <SelectItem value="fade">
                  Fade
                </SelectItem>

                <SelectItem value="slide">
                  Slide
                </SelectItem>

                <SelectItem value="zoom">
                  Zoom
                </SelectItem>

              </SelectContent>

            </Select>

            <FormMessage />

          </FormItem>
        )}
      />

    </div>

    {/* RIGHT COLUMN */}

    <div className="space-y-6 rounded-xl border p-6">

      <h3 className="text-lg font-semibold">
        Controls
      </h3>

      <FormField
        control={form.control}
        name="pause_on_hover"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">

            <div>
              <FormLabel>
                Pause On Hover
              </FormLabel>

              <FormDescription>
                Pause autoplay while hovering.
              </FormDescription>
            </div>

            <FormControl>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />

            </FormControl>

          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="enable_swipe"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">

            <div>

              <FormLabel>
                Enable Swipe
              </FormLabel>

              <FormDescription>
                Allow touch gestures.
              </FormDescription>

            </div>

            <FormControl>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />

            </FormControl>

          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="show_arrows"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">

            <FormLabel>
              Show Arrows
            </FormLabel>

            <FormControl>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />

            </FormControl>

          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="show_dots"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">

            <FormLabel>
              Show Dots
            </FormLabel>

            <FormControl>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />

            </FormControl>

          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="show_progress"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">

            <FormLabel>
              Show Progress Bar
            </FormLabel>

            <FormControl>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />

            </FormControl>

          </FormItem>
        )}
      />

    </div>

  </div>

  {/* Part 3 starts here */}
  <div className="flex items-center justify-between border-t pt-6">
  <Button
    type="button"
    variant="outline"
    disabled={!form.formState.isDirty}
    onClick={() => {
      if (!settings) return;

      form.reset({
        autoplay: settings.autoplay,
        autoplay_speed: settings.autoplay_speed,
        transition_duration: settings.transition_duration,
        pause_on_hover: settings.pause_on_hover,
        enable_swipe: settings.enable_swipe,
        show_arrows: settings.show_arrows,
        show_dots: settings.show_dots,
        show_progress: settings.show_progress,
        transition_type: settings.transition_type,
      });
    }}
  >
    Reset
  </Button>

  <Button
    type="submit"
    disabled={
      updateMutation.isPending ||
      !form.formState.isDirty
    }
  >
    {updateMutation.isPending
      ? "Saving..."
      : "Save Changes"}
  </Button>
</div>

</Form>
    </form>
  );
}
