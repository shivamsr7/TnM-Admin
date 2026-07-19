import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import DataTable, {
  type Column,
} from "@/components/shared/DataTable";

import type { Order } from "../types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({
  orders,
}: OrdersTableProps) {
  const navigate = useNavigate();

  const columns: Column<Order>[] = [
    {
      key: "order_number",
      title: "Order",
      render: (_, order) => (
        <div>
          <p className="font-semibold">
            #{order.order_number}
          </p>

          <p className="text-xs text-gray-500">
            {new Date(
              order.created_at
            ).toLocaleDateString()}
          </p>
        </div>
      ),
    },

    {
      key: "customer_name",
      title: "Customer",
      render: (_, order) => (
        <div>
          <p className="font-medium">
            {order.customer_name}
          </p>

          <p className="text-xs text-gray-500">
            {order.customer_phone}
          </p>
        </div>
      ),
    },

    {
      key: "total_amount",
      title: "Total",
      render: (value) => (
        <span className="font-semibold">
          ₹{Number(value).toLocaleString()}
        </span>
      ),
    },

    {
      key: "advance_payment_status",
      title: "Advance",
      render: (value) => (
        <PaymentStatusBadge
          status={value as Order["advance_payment_status"]}
        />
      ),
    },

    {
      key: "cod_payment_status",
      title: "COD",
      render: (value) => (
        <PaymentStatusBadge
          status={value as Order["cod_payment_status"]}
        />
      ),
    },

    {
      key: "order_status",
      title: "Order Status",
      render: (value) => (
        <OrderStatusBadge
          status={value as Order["order_status"]}
        />
      ),
    },

    {
      key: "id",
      title: "Actions",
      render: (_, order) => (
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            navigate(`/orders/${order.id}`)
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable<Order>
      columns={columns}
      data={orders}
    />
  );
}