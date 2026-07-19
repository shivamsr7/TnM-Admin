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
export function useOrderHistory(orderId: string) {
  return useQuery({
    queryKey: ["order-history", orderId],

    queryFn: () =>
      orderService.getOrderHistory(orderId),

    enabled: !!orderId,
  });
}
export function useOrderActivity(orderId: string) {
  return useQuery({
    queryKey: ["order-activity", orderId],

    queryFn: () =>
      orderService.getOrderActivity(orderId),

    enabled: !!orderId,
  });
}
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: OrderStatus;
      notes?: string;
    }) =>
      orderService.updateStatus(
        id,
        status,
        notes
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["order-history", variables.id],
      });
      queryClient.invalidateQueries({
  queryKey: ["order-activity", variables.id],
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
export function useUpdateTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      courier_name,
      tracking_number,
    }: {
      id: string;
      courier_name: string;
      tracking_number: string;
    }) =>
      orderService.updateTracking(
        id,
        courier_name,
        tracking_number
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["order-activity", variables.id],
      });
    },
  });
}