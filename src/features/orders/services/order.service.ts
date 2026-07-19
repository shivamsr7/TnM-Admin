import { supabase } from "@/lib/supabase";

import type {
  Order,
  OrderStatus,
} from "../types/order.types";

class OrderService {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data ?? [];
  }
async getOrderItems(orderId: string) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (error) throw error;

  return data ?? [];
}
async updateOrder(id: string, updates: Partial<Order>) {
  const { error } = await supabase
    .from("orders")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
  async getById(id: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async updateStatus(
    id: string,
    status: OrderStatus
  ) {
    const { error } = await supabase
      .from("orders")
      .update({
        order_status: status,
      })
      .eq("id", id);

    if (error) throw error;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

export const orderService =
  new OrderService();