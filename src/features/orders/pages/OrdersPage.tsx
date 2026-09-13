import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import LoadingSpinner from "@/shared/components/LoadingSpinner";

import OrdersTable from "../components/OrdersTable";
import { useOrders } from "../hooks/useOrders";

type OrderFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

const statusLabels: Record<Exclude<OrderFilter, "all">, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const statusIcons: Record<
  Exclude<OrderFilter, "all">,
  typeof Clock3
> = {
  pending: Clock3,
  confirmed: CheckCircle2,
  processing: PackageCheck,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
  returned: ArrowDown,
};

export default function OrdersPage() {
  const { data = [], isLoading } = useOrders();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<OrderFilter>("all");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredOrders = useMemo(() => {
    return data.filter((order) => {
      const matchesStatus =
        activeFilter === "all" ||
        order.order_status === activeFilter;

      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      return (
        order.order_number
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.customer_name
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.customer_phone.includes(normalizedSearch)
      );
    });
  }, [data, activeFilter, normalizedSearch]);

  const statusCount = (status: OrderFilter) =>
    status === "all"
      ? data.length
      : data.filter(
          (order) => order.order_status === status
        ).length;

  const attentionCount =
    statusCount("pending") +
    statusCount("confirmed");

  const totalRevenue = useMemo(
    () =>
      data.reduce(
        (sum, order) =>
          sum + Number(order.total_amount || 0),
        0
      ),
    [data]
  );

  const activeOrders =
    statusCount("pending") +
    statusCount("confirmed") +
    statusCount("processing") +
    statusCount("shipped");

  const deliveredOrders = statusCount("delivered");

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 pb-8">
      {/* Premium page header */}
      <section className="relative overflow-hidden rounded-[26px] bg-slate-950 text-white shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-amber-200/[0.06] blur-3xl" />

        <div className="relative px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                <ShoppingBag className="h-3 w-3" />
                Sales Command Center
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Orders
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                Everything you need to review, prioritize and
                manage customer orders from one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Total orders
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {data.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Order value
                </p>
                <p className="mt-1 text-xl font-semibold">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by order number, customer name or phone..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-white/25 focus:bg-white/[0.1]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-white/50 hover:bg-white/10 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-white/60">
                {activeOrders} active orders
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key order metrics */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          label="Needs attention"
          value={attentionCount}
          description="Pending + confirmed"
          icon={AlertCircle}
          emphasized={attentionCount > 0}
        />

        <MetricCard
          label="In progress"
          value={statusCount("processing")}
          description="Being prepared"
          icon={PackageCheck}
        />

        <MetricCard
          label="On the way"
          value={statusCount("shipped")}
          description="Shipped orders"
          icon={Truck}
        />

        <MetricCard
          label="Delivered"
          value={deliveredOrders}
          description="Successfully delivered"
          icon={CheckCircle2}
        />
      </section>

      {/* Order workflow */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Order workflow
              </p>
              <h2 className="mt-1 text-base font-semibold text-slate-950">
                Find the orders that need you
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Showing {filteredOrders.length} of {data.length} orders
            </p>
          </div>

          {/* Desktop workflow tabs */}
          <div className="mt-4 hidden overflow-x-auto lg:block">
            <div className="flex min-w-max items-center gap-1 rounded-xl bg-slate-50 p-1">
              <WorkflowTab
                label="All orders"
                count={statusCount("all")}
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              />

              {(
                [
                  "pending",
                  "confirmed",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                  "returned",
                ] as const
              ).map((status) => (
                <WorkflowTab
                  key={status}
                  label={statusLabels[status]}
                  count={statusCount(status)}
                  active={activeFilter === status}
                  onClick={() => setActiveFilter(status)}
                />
              ))}
            </div>
          </div>

          {/* Mobile workflow selector */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <MobileFilter
              label="All"
              count={statusCount("all")}
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />

            {(
              [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
              ] as const
            ).map((status) => {
              const Icon = statusIcons[status];

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveFilter(status)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    activeFilter === status
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {statusLabels[status]}
                  <span
                    className={
                      activeFilter === status
                        ? "text-white/60"
                        : "text-slate-400"
                    }
                  >
                    {statusCount(status)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results summary */}
        {(search || activeFilter !== "all") && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">
                {filteredOrders.length}
              </span>
              matching orders
              {activeFilter !== "all" && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium">
                    {statusLabels[activeFilter]}
                  </span>
                </>
              )}
              {search && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="truncate">
                    “{search}”
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-950"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Existing order table — data/action logic unchanged */}
        <div className="min-w-0">
          {filteredOrders.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ShoppingBag className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No orders found
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Try changing the status filter or searching
                with a different order number, customer name
                or phone number.
              </p>

              {(search || activeFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("all");
                  }}
                  className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  View all orders
                </button>
              )}
            </div>
          ) : (
            <OrdersTable orders={filteredOrders} />
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  emphasized = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Clock3;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        emphasized
          ? "border-amber-200 bg-amber-50/30"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            emphasized
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-2xl font-semibold tracking-tight text-slate-950">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-700">
        {label}
      </p>
      <p className="mt-0.5 text-[10px] text-slate-400">
        {description}
      </p>
    </div>
  );
}

function WorkflowTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] ${
          active
            ? "bg-slate-100 text-slate-600"
            : "bg-slate-200/70 text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function MobileFilter({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      {label}
      <span
        className={
          active ? "text-white/60" : "text-slate-400"
        }
      >
        {count}
      </span>
    </button>
  );
}
