export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentMethod =
  | "partial_cod"
  | "prepaid";

export type AdvancePaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type CodPaymentStatus =
  | "pending"
  | "collected";

export interface Order {
  id: string;

  order_number: string;

  customer_name: string;

  customer_email: string | null;

  customer_phone: string;

  subtotal: number;

  discount: number;

  shipping_charge: number;

  tax: number;

  total_amount: number;

  advance_amount: number;

  remaining_amount: number;

  payment_method: PaymentMethod;

  advance_payment_status: AdvancePaymentStatus;

  cod_payment_status: CodPaymentStatus;

  order_status: OrderStatus;

  notes: string | null;

  created_at: string;

  updated_at: string;
}

export interface OrderItem {
  id: string;

  order_id: string;

  product_id: string | null;

  product_name: string;

  product_image: string | null;

  price: number;

  quantity: number;

  total: number;
}