import {
  createContext,
  useContext,
} from "react";

import type {
  UseFormReturn,
} from "react-hook-form";

import type {
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";

import type { StoreSettingsFormValues } from "../schemas/settings.schema";
import type { StoreSettings } from "../types/settings.types";

interface SettingsContextValue {
  form: UseFormReturn<StoreSettingsFormValues>;

  settingsQuery: UseQueryResult<StoreSettings>;

  updateMutation: UseMutationResult<
    void,
    Error,
    StoreSettingsFormValues
  >;

  save: () => void;

  discard: () => void;

  isSaving: boolean;

  isDirty: boolean;
}

const SettingsContext =
  createContext<SettingsContextValue | null>(
    null
  );

export default SettingsContext;

export function useSettingsContext() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettingsContext must be used inside SettingsProvider."
    );
  }

  return context;
}

export { SettingsContext };