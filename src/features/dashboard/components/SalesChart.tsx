import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
} from "recharts";

import SalesChartHeader from "./SalesChartHeader";
import SalesSummary from "./SalesSummary";
import { useSalesChart } from "../hooks/useSalesChart";
import type { SalesPeriod } from "../types/dashboard.types";


export default function SalesChart() {
  const [period, setPeriod] = useState<SalesPeriod>(30);

  const { data, isLoading } = useSalesChart(period);

  const chartData = useMemo(() => data?.chart ?? [], [data]);

  const summary = data?.summary;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <SalesChartHeader
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="mt-8 h-[380px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid
  strokeDasharray="4 4"
  vertical={false}
  stroke="#e5e7eb"
/>

              <XAxis
  dataKey="date"
  tickLine={false}
  axisLine={false}
/>

              <YAxis
  tickLine={false}
  axisLine={false}
  tickFormatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
/>

              <Tooltip
  cursor={{ fill: "#f8fafc" }}
  content={(props) => {
    const { active, payload, label } = props;

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
        <p className="mb-3 text-sm font-semibold">{label}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Gross Revenue</span>
            <span>₹{revenue.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivered Revenue</span>
            <span>₹{deliveredRevenue.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between">
            <span>Orders</span>
            <span>{orders}</span>
          </div>
        </div>
      </div>
    );
  }}
/>

              <Legend
  verticalAlign="top"
  height={40}
  iconType="circle"
/>

              <Bar
  dataKey="orders"
  fill="#c4b5fd"
  radius={[8, 8, 0, 0]}
  maxBarSize={28}
/>

              <Line
  type="monotone"
  dataKey="revenue"
  stroke="#2563eb"
  strokeWidth={3}
  dot={false}
  activeDot={{ r: 6 }}
/>

              <Line
  type="monotone"
  dataKey="deliveredRevenue"
  stroke="#16a34a"
  strokeWidth={3}
  dot={false}
  activeDot={{ r: 6 }}
/>
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {summary && (
        <div className="mt-8">
          <SalesSummary
            grossRevenue={summary.grossRevenue}
            deliveredRevenue={summary.deliveredRevenue}
            totalOrders={summary.totalOrders}
          />
        </div>
      )}
    </div>
  );
}