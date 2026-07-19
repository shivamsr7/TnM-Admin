import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { orderService } from "../services/order.service";

import type {
  Order,
  OrderStatus,
} from "../types/order.types";
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getAll(),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: OrderStatus;
    }) =>
      orderService.updateStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      orderService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}
export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ["order-items", orderId],
    queryFn: () =>
      orderService.getOrderItems(orderId),
    enabled: !!orderId,
  });
}
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Order>;
    }) =>
      orderService.updateOrder(id, updates),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}