import { Button } from "@/components/ui/button";

import { useSettingsContext } from "../context/SettingsContext";

export default function SaveBar() {
  const {
    save,
    discard,
    isDirty,
    isSaving,
  } = useSettingsContext();

  if (!isDirty) return null;

  return (
    <div className="sticky bottom-4 z-50 mx-auto mt-8 flex max-w-5xl items-center justify-between rounded-xl border bg-white p-4 shadow-lg">
      <div>
        <p className="font-medium">
          You have unsaved changes.
        </p>

        <p className="text-sm text-muted-foreground">
          Save your changes before leaving this page.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={discard}
          disabled={isSaving}
        >
          Discard
        </Button>

        <Button
          onClick={save}
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}