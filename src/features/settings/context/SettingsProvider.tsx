import type { ReactNode } from "react";

import SettingsContext from "./SettingsContext";

import { useGeneralSettings } from "../hooks/useSettings";
import { mapStoreSettingsToFormValues } from "../utils/settings.mapper";
interface Props {
  children: ReactNode;
}

export default function SettingsProvider({
  children,
}: Props) {
  const {
    form,
    settingsQuery,
    updateMutation,
  } = useGeneralSettings();

  const save = () => {
    form.handleSubmit((values) => {
      updateMutation.mutate(values);
    })();
  };

  const discard = () => {
    if (!settingsQuery.data) return;

    form.reset(
  mapStoreSettingsToFormValues(settingsQuery.data)
);
  };

  return (
    <SettingsContext.Provider
      value={{
        form,
        settingsQuery,
        updateMutation,

        save,
        discard,

        isDirty: form.formState.isDirty,
        isSaving: updateMutation.isPending,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}