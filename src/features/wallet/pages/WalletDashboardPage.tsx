import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  CreditCard,
  RefreshCcw,
  Wallet,
  Users,
  IndianRupee,
  Settings,
  ArrowRight,
  Search,
  X,
  UserRound,
  Mail,
  Phone,
} from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "@/features/customers/hooks/useCustomer";

import {
  useWalletDashboardActivity,
  useWalletDashboardStats,
} from "../hooks/useWalletDashboard";
import { useWalletAnalytics } from "../hooks/useWalletAnalytics";
import type { WalletAnalyticsPeriod } from "../services/walletAnalytics.service";

function formatRupees(paise: number) {
  return `₹${(Number(paise || 0) / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActivityType(
  type: string,
  referenceType?: string | null
) {
  if (
    type === "debit" ||
    type === "expiry" ||
    referenceType === "admin_debit" ||
    referenceType === "wallet_expiry"
  ) {
    return "debit";
  }

  return "credit";
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: typeof Wallet;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-muted p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function WalletDashboardPage() {
  const navigate = useNavigate();

  const [analyticsPeriod, setAnalyticsPeriod] =
    React.useState<WalletAnalyticsPeriod>(30);

  const [customerSearch, setCustomerSearch] =
    React.useState("");

  const statsQuery = useWalletDashboardStats();
  const activityQuery = useWalletDashboardActivity();
  const analyticsQuery = useWalletAnalytics(analyticsPeriod);

  const {
    data: customers = [],
    isLoading: customersLoading,
  } = useCustomers();

  const stats = statsQuery.data;
  const analytics = analyticsQuery.data;

  const isLoading =
    statsQuery.isLoading || activityQuery.isLoading;

  const hasError =
    statsQuery.isError || activityQuery.isError;

  const activity = activityQuery.data ?? [];

  const filteredCustomers = React.useMemo(() => {
    const query = customerSearch.trim().toLowerCase();

    if (!query) return [];

    return customers
      .filter((customer: any) => {
        const name = [
          customer.first_name,
          customer.last_name,
        ]
          .filter(Boolean)
          .join(" ");

        return [name, customer.email, customer.phone]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          );
      })
      .slice(0, 6);
  }, [customers, customerSearch]);

  const showCustomerSearch =
    customerSearch.trim().length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Wallet Dashboard"
          subtitle="Overview of customer wallet activity and balances."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border bg-muted/40"
            />
          ))}
        </div>
      </div>
    );
  }

  if (hasError || !stats) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Wallet Dashboard"
          subtitle="Overview of customer wallet activity and balances."
        />

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="font-medium text-destructive">
            Unable to load wallet dashboard.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet Dashboard"
        subtitle="Overview of customer wallet activity and balances."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/wallet/settings")
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Wallet Settings
            </Button>

            <Button
              onClick={() =>
                navigate("/wallet/customers")
              }
            >
              <Wallet className="mr-2 h-4 w-4" />
              Customer Wallets
            </Button>
          </div>
        }
      />

      {/* Customer Quick Search */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">
              Find Customer Wallet
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Search by name, email, or phone to quickly open wallet management.
            </p>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={customerSearch}
              onChange={(event) =>
                setCustomerSearch(event.target.value)
              }
              placeholder="Search customer..."
              className="h-11 w-full rounded-lg border bg-white pl-9 pr-9 text-sm outline-none transition focus:border-[#C8A44D] focus:ring-2 focus:ring-[#C8A44D]/10"
            />

            {customerSearch && (
              <button
                type="button"
                onClick={() => setCustomerSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-neutral-100 hover:text-foreground"
                aria-label="Clear customer search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {showCustomerSearch && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border bg-white shadow-lg">
                {customersLoading ? (
                  <div className="px-4 py-4 text-sm text-muted-foreground">
                    Searching customers...
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="px-4 py-5 text-center">
                    <UserRound className="mx-auto h-6 w-6 text-neutral-300" />

                    <p className="mt-2 text-sm font-medium">
                      No customer found
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Try a different name, email, or phone number.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredCustomers.map(
                      (customer: any) => {
                        const name =
                          [
                            customer.first_name,
                            customer.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ") ||
                          "Customer";

                        return (
                          <button
                            key={customer.id}
                            type="button"
                            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                            onClick={() => {
                              setCustomerSearch("");
                              navigate(
                                "/wallet/customers"
                              );
                            }}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                                <UserRound className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {name}
                                </p>

                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                  {customer.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {customer.email}
                                    </span>
                                  )}

                                  {customer.phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {customer.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showCustomerSearch &&
          filteredCustomers.length > 0 && (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Select a customer to open Customer Wallets.
            </p>
          )}
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Wallet Balance"
          value={formatRupees(
            stats.total_wallet_balance_paise
          )}
          icon={Wallet}
          description="Current balance across active wallets"
        />

        <StatCard
          title="Wallet Customers"
          value={stats.wallet_customer_count.toLocaleString(
            "en-IN"
          )}
          icon={Users}
          description="Customers with wallet balance"
        />

        <StatCard
          title="Total Credits"
          value={formatRupees(
            stats.total_credits_paise
          )}
          icon={ArrowDownLeft}
          description="All wallet credit transactions"
        />

        <StatCard
          title="Total Debits"
          value={formatRupees(
            stats.total_debits_paise
          )}
          icon={ArrowUpRight}
          description="All wallet debit and expiry transactions"
        />

        <StatCard
          title="Refund Credits"
          value={formatRupees(
            stats.total_refunds_paise
          )}
          icon={RefreshCcw}
          description="Wallet credits from refunds"
        />

        <StatCard
          title="Expired Amount"
          value={formatRupees(
            stats.total_expired_paise
          )}
          icon={Clock3}
          description="Wallet value expired from customers"
        />
      </div>

      {/* Analytics */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Wallet Analytics
            </h2>

            <p className="text-sm text-muted-foreground">
              Transaction breakdown for the selected period
            </p>
          </div>

          <div className="flex flex-wrap rounded-xl border bg-muted/30 p-1">
            {[
              { label: "7 Days", value: 7 as const },
              { label: "30 Days", value: 30 as const },
              { label: "90 Days", value: 90 as const },
              { label: "All Time", value: null },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() =>
                  setAnalyticsPeriod(option.value)
                }
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  analyticsPeriod === option.value
                    ? "bg-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {analyticsQuery.isLoading ? (
          <div className="mt-5 h-48 animate-pulse rounded-xl bg-muted/40" />
        ) : analyticsQuery.isError || !analytics ? (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="font-medium text-destructive">
              Unable to load analytics.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please try selecting the period again.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  label: "Credits",
                  value: analytics.credits_paise,
                  icon: ArrowDownLeft,
                },
                {
                  label: "Debits",
                  value: analytics.debits_paise,
                  icon: ArrowUpRight,
                },
                {
                  label: "Refunds",
                  value: analytics.refunds_paise,
                  icon: RefreshCcw,
                },
                {
                  label: "Expired",
                  value: analytics.expired_paise,
                  icon: Clock3,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
                        <Icon className="h-4 w-4" />
                      </div>

                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    </div>

                    <span className="font-semibold">
                      {formatRupees(item.value)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex min-h-[240px] items-center justify-center rounded-xl border bg-muted/10 p-6">
              <div className="w-full max-w-xl space-y-5">
                {[
                  {
                    label: "Credits",
                    value: analytics.credits_paise,
                  },
                  {
                    label: "Debits",
                    value: analytics.debits_paise,
                  },
                  {
                    label: "Refunds",
                    value: analytics.refunds_paise,
                  },
                  {
                    label: "Expired",
                    value: analytics.expired_paise,
                  },
                ].map((item) => {
                  const total =
                    analytics.credits_paise +
                    analytics.debits_paise +
                    analytics.refunds_paise +
                    analytics.expired_paise;

                  const percentage =
                    total > 0
                      ? (item.value / total) * 100
                      : 0;

                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{item.label}</span>

                        <span className="text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground/70 transition-all"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">
              Recent Wallet Activity
            </h2>

            <p className="text-sm text-muted-foreground">
              Latest wallet transactions across customers
            </p>
          </div>

          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>

        {activity.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No wallet activity yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Wallet transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {activity.map((item) => {
              const direction = getActivityType(
                item.transaction_type,
                item.reference_type
              );

              const isCredit =
                direction === "credit";

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      {isCredit ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.customer_name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {item.customer_email ||
                          "No email"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description ||
                          item.transaction_type.replaceAll(
                            "_",
                            " "
                          )}
                        {" • "}
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 md:justify-end">
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          isCredit
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatRupees(
                          item.amount_paise
                        )}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Balance:{" "}
                        {formatRupees(
                          item.balance_after_paise
                        )}
                      </p>
                    </div>

                    <IndianRupee className="hidden h-4 w-4 text-muted-foreground md:block" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activity.length > 0 && (
          <div className="flex justify-end border-t px-5 py-4">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() =>
                navigate("/wallet/customers")
              }
            >
              Manage Customer Wallets
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
