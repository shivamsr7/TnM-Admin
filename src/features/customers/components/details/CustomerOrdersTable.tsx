import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import StatusBadge from "@/components/shared/StatusBadge";

export interface CustomerOrder {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  order_status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
}

interface CustomerOrdersTableProps {
  orders: CustomerOrder[];
}

export default function CustomerOrdersTable({
  orders,
}: CustomerOrdersTableProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">
          Recent Orders
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Orders placed by this customer.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          No orders found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.order_number}
                </TableCell>

                <TableCell>
                  {new Date(
                    order.created_at
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  ₹{order.total.toLocaleString()}
                </TableCell>

                <TableCell>
                  <StatusBadge
                    status={order.payment_status}
                  />
                </TableCell>

                <TableCell>
                  <StatusBadge
                    status={order.order_status}
                  />
                </TableCell>

                <TableCell>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link
                      to={`/orders/${order.id}`}
                    >
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}