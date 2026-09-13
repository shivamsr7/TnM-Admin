import {
  ArrowUpRight,
  CalendarDays,
  Eye,
  Phone,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import DataTable, {
  type Column,
} from "@/components/shared/DataTable";

import type { Order } from "../types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrdersTableProps {
  orders: Order[];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "C";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(value: string) {
  const date = new Date(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const date = new Date(value);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value: unknown) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
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
        <div className="min-w-[150px] py-1">
          <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}`)}
            className="group inline-flex items-center gap-1.5 text-left"
          >
            <span className="text-sm font-bold tracking-tight text-slate-950 group-hover:text-slate-600">
              #{order.order_number}
            </span>

            <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 opacity-0 transition group-hover:text-slate-500 group-hover:opacity-100" />
          </button>

          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
            <CalendarDays className="h-3 w-3" />
            <span>{formatDate(order.created_at)}</span>
            <span className="text-slate-200">•</span>
            <span>{formatTime(order.created_at)}</span>
          </div>
        </div>
      ),
    },

    {
      key: "customer_name",
      title: "Customer",
      render: (_, order) => (
        <div className="flex min-w-[210px] items-center gap-3 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[11px] font-bold text-slate-600">
            {getInitials(order.customer_name)}
          </div>

          <div className="min-w-0">
            {order.customer_id ? (
              <Link
                to={`/customers/${order.customer_id}`}
                className="block truncate text-sm font-semibold text-slate-800 transition hover:text-slate-950 hover:underline"
              >
                {order.customer_name}
              </Link>
            ) : (
              <p className="truncate text-sm font-semibold text-slate-800">
                {order.customer_name}
              </p>
            )}

            <a
              href={`tel:${order.customer_phone}`}
              className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-400 transition hover:text-slate-700"
            >
              <Phone className="h-2.5 w-2.5" />
              {order.customer_phone}
            </a>
          </div>
        </div>
      ),
    },

    {
      key: "total_amount",
      title: "Order Value",
      render: (value) => (
        <div className="min-w-[105px]">
          <p className="text-sm font-bold tracking-tight text-slate-950">
            {formatCurrency(value)}
          </p>
          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Total payable
          </p>
        </div>
      ),
    },

    {
      key: "advance_payment_status",
      title: "Advance",
      render: (value) => (
        <div className="min-w-[95px]">
          <PaymentStatusBadge
            status={value as Order["advance_payment_status"]}
          />
        </div>
      ),
    },

    {
      key: "cod_payment_status",
      title: "COD",
      render: (value) => (
        <div className="min-w-[95px]">
          <PaymentStatusBadge
            status={value as Order["cod_payment_status"]}
          />
        </div>
      ),
    },

    {
      key: "order_status",
      title: "Order Status",
      render: (value) => (
        <div className="min-w-[125px]">
          <OrderStatusBadge
            status={value as Order["order_status"]}
          />
        </div>
      ),
    },

    {
      key: "id",
      title: "Actions",
      sticky: "right",
      render: (_, order) => (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}`)}
            aria-label={`View order ${order.order_number}`}
            className="group flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-950 hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">View</span>
          </button>
        </div>
      ),
    },
  ];

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <UserRound className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No orders to display
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
          Orders matching the current filters will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="orders-table-premium min-w-0 overflow-hidden">
      <DataTable<Order>
        columns={columns}
        data={orders}
      />
    </div>
  );
}
