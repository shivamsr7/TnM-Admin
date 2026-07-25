import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { customerService } from "../services/customer.service";
import type { CustomerFormData } from "../types/customer.types";

const QUERY_KEY = ["customers"];

export function useCustomers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => customerService.getAll(),
  });
}
export function useCustomer(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],

    queryFn: () =>
      customerService.getById(id),

    enabled: !!id,
  });
}
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CustomerFormData) =>
      customerService.create(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: CustomerFormData;
    }) => customerService.update(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      customerService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}
