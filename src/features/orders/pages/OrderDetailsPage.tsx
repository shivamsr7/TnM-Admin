import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  Package,
  ReceiptText,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import LoadingSpinner from "@/shared/components/LoadingSpinner";

import CustomerCard from "../components/CustomerCard";
import PaymentCard from "../components/PaymentCard";
import ShippingAddressCard from "../components/ShippingAddressCard";
import TrackingCard from "../components/TrackingCard";
import OrderSummaryCard from "../components/OrderSummaryCard";
import OrderItemsTable from "../components/OrderItemsTable";
import StatusCard from "../components/StatusCard";
import OrderTimeline from "../components/OrderTimeline";
import ActivityTimeline from "../components/ActivityTimeline";
import InvoiceButton from "../components/InvoiceButton";
import PackingSlipButton from "../components/PackingSlipButton";
import ShippingLabelButton from "../components/ShippingLabelButton";
import {
  useOrder,
  useOrderItems,
} from "../hooks/useOrders";

function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatOrderTime(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading: orderLoading,
  } = useOrder(id);

  const {
    data: items = [],
    isLoading: itemsLoading,
  } = useOrderItems(id);

  if (orderLoading || itemsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-[#a1813c]">
            <Package className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-xl font-semibold tracking-tight text-[#171717]">
            Order not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            The requested order does not exist or is no longer
            available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 rounded-[28px] bg-[#f8f4e9] p-1 pb-10">
      {/* Premium order hero */}
      <section className="relative overflow-hidden rounded-[26px] border border-[#e7d8b5] bg-[#fbf7ed] text-[#171717] shadow-[0_14px_40px_rgba(91,72,32,0.08)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#d4af37]/[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#d4af37]/[0.08] blur-3xl" />

        <div className="relative px-5 py-5 sm:px-7 sm:py-6">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-[#9a7620]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to orders
          </button>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7d8b5] bg-white/70">
                  <ClipboardList className="h-4.5 w-4.5" />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7620]">
                    Order
                  </p>
                  <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    #{order.order_number}
                  </h1>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatOrderDate(order.created_at)}
                </span>

                <span className="hidden text-[#d8c99f] sm:inline">
                  •
                </span>

                <span>{formatOrderTime(order.created_at)}</span>

                <span className="hidden text-[#d8c99f] sm:inline">
                  •
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin order view
                </span>
              </div>
            </div>

            {/* Documents */}
            <div className="flex flex-wrap gap-2 [&_button]:border-[#d9c48e] [&_button]:bg-white [&_button]:text-slate-800 [&_button:hover]:bg-[#f7efd9]">
              <InvoiceButton
                order={order}
                items={items}
              />

              <PackingSlipButton
                order={order}
                items={items}
              />

              <ShippingLabelButton
                order={order}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Status / workflow */}
      <section className="overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
        <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#a1813c]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
                Order workflow
              </p>
              <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
                Status & fulfilment
              </h2>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <StatusCard order={order} />
        </div>
      </section>

      {/* Timeline */}
      <section className="overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
        <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-[#a1813c]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
                Fulfilment journey
              </p>
              <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
                Order timeline
              </h2>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <OrderTimeline order={order} />
        </div>
      </section>

      {/* Customer + Payment */}
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
          <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
              Customer
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
              Customer information
            </h2>
          </div>
          <div className="p-4 sm:p-5">
            <CustomerCard order={order} />
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
          <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
              Payment
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
              Payment details
            </h2>
          </div>
          <div className="p-4 sm:p-5">
            <PaymentCard order={order} />
          </div>
        </section>
      </div>

      {/* Shipping + Tracking */}
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
          <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
              Delivery
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
              Shipping address
            </h2>
          </div>
          <div className="p-4 sm:p-5">
            <ShippingAddressCard order={order} />
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
          <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
              Logistics
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
              Tracking & shipment
            </h2>
          </div>
          <div className="p-4 sm:p-5">
            <TrackingCard order={order} />
          </div>
        </section>
      </div>

      {/* Products */}
      <section className="overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
        <div className="flex flex-col gap-1 border-b border-[#eee5cf] px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#a1813c]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
                Products
              </p>
              <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
                Items in this order
              </h2>
            </div>
          </div>

          <span className="text-xs font-medium text-[#a1813c]">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="min-w-0">
          <OrderItemsTable items={items} />
        </div>
      </section>

      {/* Summary + activity */}
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
          <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-[#a1813c]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
                  Financials
                </p>
                <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
                  Order summary
                </h2>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <OrderSummaryCard order={order} />
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7d8b5] bg-[#fffdf8] shadow-[0_8px_28px_rgba(91,72,32,0.05)]">
          <div className="border-b border-[#eee5cf] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#a1813c]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1813c]">
                  History
                </p>
                <h2 className="mt-0.5 text-sm font-semibold text-[#171717]">
                  Activity
                </h2>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <ActivityTimeline orderId={order.id} />
          </div>
        </section>
      </div>
    </div>
  );
}
