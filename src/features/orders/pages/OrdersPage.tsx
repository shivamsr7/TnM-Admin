import { useMemo, useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

import OrdersTable from "../components/OrdersTable";
import { useOrders } from "../hooks/useOrders";

export default function OrdersPage() {
  const { data = [], isLoading } = useOrders();

  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return data;

    const value = search.toLowerCase();

    return data.filter(
      (order) =>
        order.order_number
          .toLowerCase()
          .includes(value) ||
        order.customer_name
          .toLowerCase()
          .includes(value) ||
        order.customer_phone.includes(value)
    );
  }, [data, search]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders"
      />

      <div className="max-w-sm">
        <SearchBar
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search orders..."
        />
      </div>

      <OrdersTable
        orders={filteredOrders}
      />
    </div>
  );
}