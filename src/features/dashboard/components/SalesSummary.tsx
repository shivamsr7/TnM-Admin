interface SalesSummaryProps {
  grossRevenue: number;
  deliveredRevenue: number;
  totalOrders: number;
}

export default function SalesSummary({
  grossRevenue,
  deliveredRevenue,
  totalOrders,
}: SalesSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">
          Gross Revenue
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          ₹{grossRevenue.toLocaleString("en-IN")}
        </h3>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">
          Delivered Revenue
        </p>

        <h3 className="mt-2 text-2xl font-bold text-green-600">
          ₹{deliveredRevenue.toLocaleString("en-IN")}
        </h3>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">
          Orders
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          {totalOrders}
        </h3>
      </div>
    </div>
  );
}