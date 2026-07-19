"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export const Form = FormProvider;

const FormFieldContext = React.createContext<{
  name: string;
}>({ name: "" });

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(
    fieldContext.name,
    formState
  );

  return {
    name: fieldContext.name,
    ...fieldState,
  };
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props} />
  );
}

export function FormLabel(
  props: React.LabelHTMLAttributes<HTMLLabelElement>
) {
  return (
    <label
      className="text-sm font-medium"
      {...props}
    />
  );
}

export function FormControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function FormDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function FormMessage() {
  const { error } = useFormField();

  if (!error) return null;

  return (
    <p className="text-sm text-red-500">
      {String(error.message)}
    </p>
  );
}