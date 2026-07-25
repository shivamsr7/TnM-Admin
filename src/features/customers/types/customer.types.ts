export type CustomerStatus = "active" | "blocked";

export interface Customer {
  id: string;

  first_name: string;
  last_name: string | null;

  email: string | null;
  phone: string | null;

  avatar: string | null;

  status: CustomerStatus;

  email_verified: boolean;
  phone_verified: boolean;

  notes: string | null;

  last_login_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  first_name: string;
  last_name: string;

  email: string;
  phone: string;

  avatar?: string;

  status: CustomerStatus;

  notes?: string;
}
export interface CustomerAnalytics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrder: string | null;
}
export interface CustomerOrder {
  id: string;
  order_number: string;
  created_at: string;
  total: number;

  payment_status:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  order_status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
}