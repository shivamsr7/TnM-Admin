import { supabase } from "@/lib/supabase";
import { rewardsService } from "@/features/rewards/services/rewards.service";
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
async updateTracking(
  id: string,
  courier_name: string,
  tracking_number: string
) {
  const { error } = await supabase
    .from("orders")
    .update({
      courier_name,
      tracking_number,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
      if (error) throw error;
await this.createActivity({
  order_id: id,
  event_type: "tracking_added",
  title: "Tracking Updated",
  description: `${courier_name} • ${tracking_number}`,
  metadata: {
    courier_name,
    tracking_number,
  },
});

}
  async updateStatus(
  id: string,
  status: OrderStatus,
  notes?: string
) {
  // 1. Update the current order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      order_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) throw updateError;

  // 2. Insert history record
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: historyError } = await supabase
    .from("order_status_history")
    .insert({
      order_id: id,
      status,
      changed_by: user?.id ?? null,
      notes: notes ?? null,
    });
await this.createActivity({
  order_id: id,
  event_type: "status_changed",
  title: "Status Changed",
  description: `Order marked as ${status}`,
  metadata: {
    status,
  },
});

if (historyError) throw historyError;

// Load latest order
const order = await this.getById(id);

// Trigger automations
await this.handleOrderStatusChange(
  order,
  status
);
}
async getOrderHistory(orderId: string) {
  const { data, error } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", orderId)
    .order("changed_at", {
      ascending: true,
    });

  if (error) throw error;

  return data ?? [];
}
async createActivity({
  order_id,
  event_type,
  title,
  description,
  metadata,
}: {
  order_id: string;
  event_type: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("order_activity")
    .insert({
      order_id,
      event_type,
      title,
      description: description ?? null,
      metadata: metadata ?? {},
      created_by: user?.id ?? null,
    });

  if (error) throw error;
}
async getOrderActivity(orderId: string) {
  const { data, error } = await supabase
    .from("order_activity")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", {
      ascending: true,
    });

  if (error) throw error;

  return data ?? [];
}
  async delete(id: string) {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  private async handleOrderStatusChange(
  order: Order,
  status: OrderStatus
) {
  switch (status) {
    case "delivered":
      await rewardsService.processOrderReward(
        order.id
      );
      break;

    case "returned":
      await rewardsService.reverseOrderReward(
        order.id,
        "returned"
      );
      break;

    case "refunded":
      await rewardsService.reverseOrderReward(
        order.id,
        "refunded"
      );
      break;

    default:
      break;
  }
}
}

export const orderService =
  new OrderService();