import { Eye } from "lucide-react";
import { useRecentOrders } from "../hooks/useRecentOrders";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";
import { useNavigate } from "react-router-dom";
function getInitials(name: string) {
  if (!name) return "?";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}
function formatOrderTime(date: string) {
  const created = new Date(date);
  

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const orderDate = new Date(created);
  orderDate.setHours(0, 0, 0, 0);

  const time = created.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (orderDate.getTime() === today.getTime()) {
    return {
      day: "Today",
      time,
    };
  }

  if (orderDate.getTime() === yesterday.getTime()) {
    return {
      day: "Yesterday",
      time,
    };
  }

  return {
    day: created.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    time,
  };
}

export default function RecentOrdersTable() {
  const { data, isLoading } = useRecentOrders();
const navigate = useNavigate();
const openOrder = (id: string) => {
  navigate(`/orders/${id}`);
};

const openOrdersPage = () => {
  navigate("/orders");
};
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-gray-200" />

          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-16 rounded-lg bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b p-6">
        <div>
          <div>
  <h2 className="text-xl font-bold text-gray-900">
    Recent Orders
  </h2>

  <p className="mt-1 text-sm text-gray-500">
    Monitor your latest customer purchases
  </p>
</div>
        </div>

        <button
  onClick={openOrdersPage}
  className="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white"
>
  View All
</button>
      </div>

      {/* Empty State */}

      {!data?.length ? (
        <div className="flex h-60 items-center justify-center text-gray-500">
          No recent orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {data.map((order) => (
                <tr
  key={order.id}
  tabIndex={0}
  role="button"
  onClick={() => openOrder(order.id)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openOrder(order.id);
    }
  }}
  className="cursor-pointer border-b transition-all duration-200 hover:bg-violet-50 focus:bg-violet-50 focus:outline-none"
>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-sm">
  {getInitials(order.customer_name)}
</div>

                      <div>
                        <p className="font-medium">
                          {order.customer_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.customer_phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
  <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-sm font-semibold text-gray-700">
    #{order.order_number}
  </span>
</td>

                  <td className="px-6 py-4">
  <span className="text-base font-bold text-gray-900">
    ₹{Number(order.total_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </span>
</td>

                  <td className="px-6 py-4">
                    <PaymentBadge
                      method={order.payment_method}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={order.order_status}
                    />
                  </td>

                  <td className="px-6 py-4">
  {(() => {
    const formatted = formatOrderTime(order.created_at);

    return (
      <div>
        <p className="font-medium text-gray-900">
          {formatted.day}
        </p>

        <p className="text-xs text-gray-500">
          {formatted.time}
        </p>
      </div>
    );
  })()}
</td>

                  <td className="px-6 py-4">
                    <button
  onClick={(e) => {
    e.stopPropagation();
    openOrder(order.id);
  }}
  className="rounded-lg border p-2 transition-all hover:border-primary hover:bg-primary hover:text-white"
>
  <Eye size={18} />
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}