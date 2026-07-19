import { useParams } from "react-router-dom";

import LoadingSpinner from "@/shared/components/LoadingSpinner";
import PageHeader from "@/components/shared/PageHeader";

import CustomerCard from "../components/CustomerCard";
import PaymentCard from "../components/PaymentCard";
import OrderSummaryCard from "../components/OrderSummaryCard";
import OrderItemsTable from "../components/OrderItemsTable";
import StatusCard from "../components/StatusCard";

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
      <div className="rounded-xl border bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">
          Order not found
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title={`Order #${order.order_number}`}
        subtitle="Order Details"
      />

      <StatusCard order={order} />

      <div className="grid gap-6 lg:grid-cols-2">

        <CustomerCard order={order} />

        <PaymentCard order={order} />

      </div>

      <OrderItemsTable
        items={items}
      />

      <OrderSummaryCard
        order={order}
      />

    </div>
  );
}