import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { customerService } from "../services/customer.service";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success("Customer created successfully.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create customer."
      );
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof customerService.update>[1];
    }) =>
      customerService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success("Customer updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update customer."
      );
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success("Customer deleted.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete customer."
      );
    },
  });
}

