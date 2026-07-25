import { supabase } from "@/lib/supabase";

import type {
  NotifyRequest,
  NotifyStats,
} from "../types/notify.types";

class NotifyService {
  async getAll(): Promise<NotifyRequest[]> {
    const { data, error } = await supabase
      .from("notify_requests")
      .select(`
  *,
  product:products(
    id,
    name,
    slug,
    product_images(
      id,
      image_url,
      is_primary,
      sort_order
    )
  ),
  customer:customers(
    id,
    first_name,
    last_name
  )
`)
      .order("requested_at", {
        ascending: false,
      });

    if (error) throw error;

    return data ?? [];
  }

  async getById(
    id: string
  ): Promise<NotifyRequest> {
    const { data, error } = await supabase
      .from("notify_requests")
      .select(`
  *,
  product:products(
    id,
    name,
    slug,
    product_images(
      id,
      image_url,
      is_primary,
      sort_order
    )
  ),
  customer:customers(
    id,
    first_name,
    last_name
  )
`)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async create(
    values: Partial<NotifyRequest>
  ): Promise<NotifyRequest> {
    const { data, error } = await supabase
      .from("notify_requests")
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async updateStatus(
    id: string,
    status: NotifyRequest["status"]
  ) {
    const updateData: Record<
      string,
      unknown
    > = {
      status,
    };

    if (status === "notified") {
      updateData.notified_at =
        new Date().toISOString();
    }

    const { error } = await supabase
      .from("notify_requests")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from("notify_requests")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async getStats(): Promise<NotifyStats> {
    const requests =
      await this.getAll();

    return {
      totalRequests:
        requests.length,

      pendingRequests:
        requests.filter(
          (r) =>
            r.status === "pending"
        ).length,

      notifiedRequests:
        requests.filter(
          (r) =>
            r.status === "notified"
        ).length,

      purchasedRequests:
        requests.filter(
          (r) =>
            r.status === "purchased"
        ).length,

      cancelledRequests:
        requests.filter(
          (r) =>
            r.status === "cancelled"
        ).length,
    };
  }
}

export const notifyService =
  new NotifyService();