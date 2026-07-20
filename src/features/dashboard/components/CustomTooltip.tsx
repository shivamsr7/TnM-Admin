import type { TooltipContentProps } from "recharts";

export default function CustomTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  const revenue =
    Number(payload.find((item) => item.dataKey === "revenue")?.value) || 0;

  const deliveredRevenue =
    Number(
      payload.find((item) => item.dataKey === "deliveredRevenue")?.value
    ) || 0;

  const orders =
    Number(payload.find((item) => item.dataKey === "orders")?.value) || 0;

  return (
    <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
      <p className="mb-3 text-sm font-semibold text-gray-900">{label}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Gross Revenue</span>
          <span className="font-semibold">
            ₹{revenue.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Delivered Revenue</span>
          <span className="font-semibold text-green-600">
            ₹{deliveredRevenue.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Orders</span>
          <span className="font-semibold">{orders}</span>
        </div>
      </div>
    </div>
  );
}