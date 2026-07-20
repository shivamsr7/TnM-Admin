import type { SalesPeriod } from "../types/dashboard.types";

interface SalesChartHeaderProps {
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
}

const periods: SalesPeriod[] = [7, 30, 90];

export default function SalesChartHeader({
  period,
  onPeriodChange,
}: SalesChartHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Sales Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Revenue & Orders Performance
        </p>
      </div>

      <div className="flex rounded-lg border bg-gray-50 p-1">
        {periods.map((item) => (
          <button
            key={item}
            onClick={() => onPeriodChange(item)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              period === item
                ? "bg-white shadow text-primary"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {item}D
          </button>
        ))}
      </div>
    </div>
  );
}