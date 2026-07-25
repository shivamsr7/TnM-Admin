import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";

import BasicInfoSection from "./sections/BasicInfoSection";
import ContactSection from "./sections/ContactSection";
import StatusSection from "./sections/StatusSection";
import NotesSection from "./sections/NotesSection";

import {
  customerSchema,
  type CustomerSchema,
} from "../../schemas/customer.schema";

import { customerService } from "../../services/customer.service";

interface CustomerFormProps {
  mode?: "create" | "edit";
  customerId?: string;
}

export default function CustomerForm({
  mode = "create",
  customerId,
}: CustomerFormProps) {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),

    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      status: "active",
      notes: "",
    },
  });

  useEffect(() => {
    if (mode !== "edit" || !customerId) return;

    async function loadCustomer() {
      try {
        const customer =
          await customerService.getById(customerId);

        form.reset({
          first_name: customer.first_name,
          last_name: customer.last_name ?? "",
          email: customer.email ?? "",
          phone: customer.phone,
          status: customer.status,
          notes: customer.notes ?? "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load customer.");
      }
    }

    loadCustomer();
  }, [mode, customerId, form]);

  async function onSubmit(values: CustomerSchema) {
    try {
      setSaving(true);

      if (mode === "create") {
        await customerService.create(values);

        toast.success("Customer created successfully.");
      } else {
        if (!customerId) {
          throw new Error("Customer ID is missing.");
        }

        await customerService.update(
          customerId,
          values
        );

        toast.success("Customer updated successfully.");
      }

      navigate("/customers");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save customer."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Header */}

        <div className="flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {mode === "create"
                ? "Add Customer"
                : "Edit Customer"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "create"
                ? "Create a new customer."
                : "Update customer information."}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? mode === "create"
                  ? "Saving..."
                  : "Updating..."
                : mode === "create"
                  ? "Save Customer"
                  : "Update Customer"}
            </Button>
          </div>
        </div>

        <BasicInfoSection
          form={form}
        />

        <ContactSection
          form={form}
        />

        <StatusSection
          form={form}
        />

        <NotesSection
          form={form}
        />

        {/* Sticky Bottom Actions */}

        <div className="sticky bottom-0 z-20 flex flex-col gap-3 rounded-xl border bg-background/95 p-4 backdrop-blur md:flex-row md:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Save Customer"
                : "Update Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}