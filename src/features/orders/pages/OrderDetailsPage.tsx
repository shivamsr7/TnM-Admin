import { useParams } from "react-router-dom";

import PageHeader from "@/components/shared/PageHeader";
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

export default function OrderDetailsPage() {
  const { id = "" } = useParams();

  const {
    data: order,
    isLoading: orderLoading,
  } = useOrder(id);

  const {
    data: items = [],
    isLoading: itemsLoading,
  } = useOrderItems(id);

  if (orderLoading || itemsLoading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold">
          Order not found
        </h2>

        <p className="mt-2 text-gray-500">
          The requested order does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order #${order.order_number}`}
        subtitle="View and manage customer order"
      />
<div className="flex flex-wrap gap-2">
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
      {/* Order Actions */}
      <StatusCard order={order} />

      {/* Timeline */}
      <OrderTimeline order={order} />

      {/* Customer & Payment */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CustomerCard order={order} />
        <PaymentCard order={order} />
      </div>

      {/* Shipping & Tracking */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ShippingAddressCard order={order} />
        <TrackingCard order={order} />
      </div>

      {/* Products */}
      <OrderItemsTable items={items} />

<ActivityTimeline
  orderId={order.id}
/>
      {/* Order Summary */}
      <OrderSummaryCard order={order} />
    </div>
  );
}