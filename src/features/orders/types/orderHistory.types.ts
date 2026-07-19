export interface OrderStatusHistory {
  id: string;

  order_id: string;

  status:
    | "pending"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"
    | "refunded";

  changed_at: string;

  changed_by: string | null;

  notes: string | null;
}