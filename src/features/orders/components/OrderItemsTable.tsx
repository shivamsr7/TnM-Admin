import type { OrderItem } from "../types/order.types";

interface OrderItemsTableProps {
  items: OrderItem[];
}

export default function OrderItemsTable({
  items,
}: OrderItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-gray-500">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">
          Ordered Products
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Product
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Qty
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Price
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.product_image ||
                        "https://placehold.co/80x80"
                      }
                      alt={item.product_name}
                      className="h-14 w-14 rounded-lg border object-cover"
                    />

                    <div>
                      <p className="font-medium">
                        {item.product_name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Product ID:{" "}
                        {item.product_id ?? "-"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center font-medium">
                  {item.quantity}
                </td>

                <td className="px-6 py-4 text-right">
                  ₹{item.price.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  ₹{item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}