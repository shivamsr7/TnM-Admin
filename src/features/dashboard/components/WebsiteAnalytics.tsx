import {
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Gem,
  RefreshCw,
  TrendingUp,
  Users,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Radio,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  AlertTriangle,
  Lightbulb,
  ArrowDownRight,
} from "lucide-react";
import { useEffect, useState } from "react";

import StatsCard from "./StatsCard";
import {
  useWebsiteAnalytics,
  type AnalyticsRange,
} from "../hooks/useWebsiteAnalytics";

function formatNumber(value: number | null | undefined) {
  const safeValue =
    typeof value === "number" && Number.isFinite(value)
      ? value
      : 0;

  return new Intl.NumberFormat("en-IN").format(safeValue);
}

function rangeLabel(days: AnalyticsRange) {
  if (days === 1) return "Today";
  if (days === 7) return "Last 7 days";
  return "Last 30 days";
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}


interface ConversionFunnelProps {
  funnel: {
    unique_visitors: number;
    product_viewers: number;
    add_to_cart_users: number;
    checkout_users: number;
    purchasers: number;
  } | null;
  isLoading: boolean;
}

function ConversionFunnel({ funnel, isLoading }: ConversionFunnelProps) {
  const data = funnel ?? {
    unique_visitors: 0,
    product_viewers: 0,
    add_to_cart_users: 0,
    checkout_users: 0,
    purchasers: 0,
  };

  const stages = [
    { label: "Visitors", value: data.unique_visitors, icon: Users },
    { label: "Product Viewers", value: data.product_viewers, icon: Gem },
    { label: "Added to Cart", value: data.add_to_cart_users, icon: ShoppingCart },
    { label: "Checkout Started", value: data.checkout_users, icon: CreditCard },
    { label: "Purchasers", value: data.purchasers, icon: CheckCircle2 },
  ];

  const rate = (current: number, previous: number) =>
    previous > 0 ? (current / previous) * 100 : 0;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-950">
            Conversion Funnel
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            See where visitors move from browsing to purchase.
          </p>
        </div>
        <span className="text-xs text-neutral-400">Unique visitors at each stage</span>
      </div>

      {isLoading ? (
        <div className="mt-6 h-44 animate-pulse rounded-xl bg-neutral-100" />
      ) : (
        <>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const previous = index === 0 ? stage.value : stages[index - 1].value;
              const stageRate = index === 0 ? 100 : rate(stage.value, previous);

              return (
                <div key={stage.label} className="relative">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-800 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      {index > 0 && (
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-neutral-500">
                          {stageRate.toFixed(stageRate >= 10 ? 0 : 1)}%
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-xs font-medium text-neutral-500">{stage.label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                      {formatNumber(stage.value)}
                    </p>
                  </div>
                  {index < stages.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 z-10 h-1 w-4 -translate-y-1/2 rounded-full bg-neutral-200" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <p className="text-xs text-neutral-500">Visitor → Product</p>
              <p className="mt-1 text-sm font-semibold text-neutral-950">
                {rate(data.product_viewers, data.unique_visitors).toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <p className="text-xs text-neutral-500">Product → Cart</p>
              <p className="mt-1 text-sm font-semibold text-neutral-950">
                {rate(data.add_to_cart_users, data.product_viewers).toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <p className="text-xs text-neutral-500">Checkout → Purchase</p>
              <p className="mt-1 text-sm font-semibold text-neutral-950">
                {rate(data.purchasers, data.checkout_users).toFixed(1)}%
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


interface LiveVisitor {
  visitor_id: string;
  session_id: string;
  page_path: string;
  product_id: string | null;
  product_name: string | null;
  device_type: "mobile" | "tablet" | "desktop";
  last_seen: string;
}

interface LiveAnalytics {
  active_visitors: number;
  active_sessions: number;
  mobile_visitors: number;
  tablet_visitors: number;
  desktop_visitors: number;
  top_page: string | null;
  top_page_visitors: number;
  top_product_id: string | null;
  top_product_name: string | null;
  top_product_visitors: number;
}

interface LiveNowProps {
  live: LiveAnalytics | null;
  visitors: LiveVisitor[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  onRefresh: () => void;
}

function formatLastSeen(value: string) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 1000)
  );

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function DeviceIcon({ type }: { type: LiveVisitor["device_type"] }) {
  if (type === "mobile") {
    return <Smartphone className="h-3.5 w-3.5" />;
  }

  if (type === "tablet") {
    return <Tablet className="h-3.5 w-3.5" />;
  }

  return <Monitor className="h-3.5 w-3.5" />;
}

function LiveNow({
  live,
  visitors,
  isLoading,
  isFetching,
  error,
  onRefresh,
}: LiveNowProps) {
  const data = live ?? {
    active_visitors: 0,
    active_sessions: 0,
    mobile_visitors: 0,
    tablet_visitors: 0,
    desktop_visitors: 0,
    top_page: null,
    top_page_visitors: 0,
    top_product_id: null,
    top_product_name: null,
    top_product_visitors: 0,
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 bg-neutral-950 px-5 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Radio className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.15)]" />
              </span>

              <div>
                <h3 className="text-base font-semibold">
                  Live Now
                </h3>
                <p className="mt-0.5 text-xs text-neutral-400">
                  Visitors active in the last 2 minutes.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-neutral-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-5">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              Unable to load live visitors.
            </p>
            <p className="mt-1 text-xs text-red-600">
              {error.message}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
              <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-700">
                    Active Visitors
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-950">
                    {formatNumber(data.active_visitors)}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-xs font-medium text-neutral-500">
                    Active Sessions
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-950">
                    {formatNumber(data.active_sessions)}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-xs font-medium text-neutral-500">
                    Most Active Page
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-neutral-950">
                    {data.top_page || "No active page"}
                  </p>
                  {data.top_page && (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      {formatNumber(data.top_page_visitors)} visitor
                      {data.top_page_visitors === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-xs font-medium text-neutral-500">
                    Most Active Product
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-neutral-950">
                    {data.top_product_name || "No active product"}
                  </p>
                  {data.top_product_name && (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      {formatNumber(data.top_product_visitors)} visitor
                      {data.top_product_visitors === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Devices
                    </p>
                    <span className="text-xs text-neutral-400">
                      {formatNumber(data.active_visitors)} total
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      {
                        label: "Mobile",
                        value: data.mobile_visitors,
                        icon: Smartphone,
                      },
                      {
                        label: "Tablet",
                        value: data.tablet_visitors,
                        icon: Tablet,
                      },
                      {
                        label: "Desktop",
                        value: data.desktop_visitors,
                        icon: Monitor,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const percentage =
                        data.active_visitors > 0
                          ? (item.value / data.active_visitors) * 100
                          : 0;

                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-neutral-600">
                              <Icon className="h-3.5 w-3.5" />
                              {item.label}
                            </span>
                            <span className="font-semibold text-neutral-900">
                              {formatNumber(item.value)}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                            <div
                              className="h-full rounded-full bg-neutral-900 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="min-w-0 overflow-hidden rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Active Visitors
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        Anonymous live sessions
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-neutral-500">
                      {formatNumber(visitors.length)} shown
                    </span>
                  </div>

                  {visitors.length === 0 ? (
                    <div className="flex min-h-40 flex-col items-center justify-center px-5 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                        <Users className="h-4 w-4 text-neutral-400" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-neutral-700">
                        No active visitors right now
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        This will update automatically as shoppers browse.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {visitors.map((visitor) => (
                        <div
                          key={`${visitor.visitor_id}-${visitor.session_id}`}
                          className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,180px)_auto] sm:items-center"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                              <p className="truncate text-sm font-medium text-neutral-900">
                                {visitor.product_name || visitor.page_path}
                              </p>
                            </div>
                            <p className="mt-1 break-all pl-4 text-xs text-neutral-400">
                              {visitor.page_path}
                            </p>
                          </div>

                          <div className="flex min-w-0 items-center gap-2 text-xs text-neutral-500">
                            {visitor.product_name ? (
                              <span className="flex min-w-0 items-center gap-1.5 truncate rounded-lg bg-neutral-50 px-2 py-1">
                                <Gem className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {visitor.product_name}
                                </span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 rounded-lg bg-neutral-50 px-2 py-1">
                                <MapPin className="h-3 w-3" />
                                Browsing
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-50 px-2 py-1 text-[11px] text-neutral-500">
                              <DeviceIcon type={visitor.device_type} />
                              {visitor.device_type}
                            </span>
                            <span className="whitespace-nowrap text-[11px] text-neutral-400">
                              {formatLastSeen(visitor.last_seen)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


interface AnalyticsInsightsProps {
  funnel: ConversionFunnelProps["funnel"];
  topPages: Array<{
    page_path: string;
    views: number;
    unique_visitors: number;
  }>;
  topProducts: Array<{
    product_id: string;
    product_name: string | null;
    views: number;
    unique_visitors: number;
  }>;
  trend: Array<{
    date: string;
    unique_visitors: number;
    page_views: number;
    sessions: number;
    product_views: number;
  }>;
  isLoading: boolean;
  days: AnalyticsRange;
}

function AnalyticsInsights({
  funnel,
  topPages,
  topProducts,
  trend,
  isLoading,
  days,
}: AnalyticsInsightsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="h-5 w-36 animate-pulse rounded bg-neutral-100" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-neutral-100"
            />
          ))}
        </div>
      </div>
    );
  }

  const data = funnel;

  const hasFunnelData =
    !!data &&
    data.unique_visitors > 0;

  const transitions = hasFunnelData
    ? [
        {
          label: "Visitor → Product",
          current: data.product_viewers,
          previous: data.unique_visitors,
        },
        {
          label: "Product → Cart",
          current: data.add_to_cart_users,
          previous: data.product_viewers,
        },
        {
          label: "Cart → Checkout",
          current: data.checkout_users,
          previous: data.add_to_cart_users,
        },
        {
          label: "Checkout → Purchase",
          current: data.purchasers,
          previous: data.checkout_users,
        },
      ]
    : [];

  const validTransitions = transitions.filter(
    (item) => item.previous > 0
  );

  const weakestTransition =
    validTransitions.length > 0
      ? validTransitions.reduce((weakest, item) => {
          const currentRate =
            item.current / item.previous;
          const weakestRate =
            weakest.current / weakest.previous;

          return currentRate < weakestRate
            ? item
            : weakest;
        })
      : null;

  const weakestRate = weakestTransition
    ? (weakestTransition.current /
        weakestTransition.previous) *
      100
    : null;

  const peakDay =
    trend.length > 0
      ? trend.reduce((best, point) =>
          point.unique_visitors >
          best.unique_visitors
            ? point
            : best
        )
      : null;

  const topPage =
    topPages.length > 0
      ? topPages[0]
      : null;

  const topProduct =
    topProducts.length > 0
      ? topProducts[0]
      : null;

  const insights: Array<{
    tone: "attention" | "positive" | "neutral";
    title: string;
    description: string;
    recommendation: string;
    icon: typeof AlertTriangle;
  }> = [];

  if (weakestTransition && weakestRate !== null) {
    const isVeryLow = weakestRate < 10;

    insights.push({
      tone: isVeryLow
        ? "attention"
        : "neutral",
      title: "Biggest funnel drop-off",
      description:
        `${weakestTransition.label} is currently your weakest step at ` +
        `${weakestRate.toFixed(1)}% ` +
        `(${formatNumber(
          weakestTransition.current
        )} of ${formatNumber(
          weakestTransition.previous
        )}).`,
      recommendation:
        weakestTransition.label ===
        "Visitor → Product"
          ? "Improve landing-page merchandising, category visibility, and product discovery."
          : weakestTransition.label ===
              "Product → Cart"
            ? "Review product pricing, images, offers, delivery messaging, and the Add to Cart CTA."
            : weakestTransition.label ===
                "Cart → Checkout"
              ? "Review cart clarity, shipping charges, coupon visibility, and checkout friction."
              : "Review payment options, checkout errors, and trust messaging.",
      icon: ArrowDownRight,
    });
  }

  if (topProduct) {
    insights.push({
      tone: "positive",
      title: "Product getting the most attention",
      description:
        `${topProduct.product_name || "Unnamed product"} has ` +
        `${formatNumber(topProduct.views)} views from ` +
        `${formatNumber(topProduct.unique_visitors)} unique visitors ` +
        `in this period.`,
      recommendation:
        "Use this product as a candidate for homepage placement, Reels, Stories, or a focused promotion.",
      icon: Lightbulb,
    });
  }

  if (topPage) {
    insights.push({
      tone: "neutral",
      title: "Your busiest page",
      description:
        `${topPage.page_path} received ` +
        `${formatNumber(topPage.views)} views from ` +
        `${formatNumber(topPage.unique_visitors)} unique visitors.`,
      recommendation:
        "Make sure this page has a clear next step into products, cart, or your strongest collection.",
      icon: TrendingUp,
    });
  }

  if (peakDay) {
    insights.push({
      tone: "neutral",
      title: "Peak visitor day",
      description:
        `${formatDate(peakDay.date)} had your highest daily visitor count ` +
        `at ${formatNumber(peakDay.unique_visitors)} visitors.`,
      recommendation:
        "Compare your posts, campaigns, offers, and traffic sources from that day to identify what drove the spike.",
      icon: Users,
    });
  }

  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-950">
              Analytics Insights
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Actionable observations from your storefront data.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
          <p className="text-sm font-medium text-neutral-700">
            Not enough data yet.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Keep collecting visitor, product, cart, and checkout activity and insights will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-950">
                Analytics Insights
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Practical observations from the data you are collecting.
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs text-neutral-400">
          Based on {rangeLabel(
            // Insights use the already selected dashboard range.
            // The label is passed by the parent through the surrounding UI.
            days
          )}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {insights.slice(0, 4).map((insight, index) => {
          const Icon = insight.icon;

          const toneClasses =
            insight.tone === "attention"
              ? "border-amber-200 bg-amber-50"
              : insight.tone === "positive"
                ? "border-emerald-100 bg-emerald-50"
                : "border-neutral-200 bg-neutral-50";

          return (
            <div
              key={`${insight.title}-${index}`}
              className={`rounded-xl border p-4 ${toneClasses}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-800 shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-neutral-950">
                    {insight.title}
                  </h4>

                  <p className="mt-2 text-xs leading-5 text-neutral-600">
                    {insight.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white/80 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                  Recommended action
                </p>
                <p className="mt-1 text-xs leading-5 text-neutral-700">
                  {insight.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-neutral-400">
        Insights are based only on the analytics data currently available; they are suggestions, not guaranteed causes.
      </p>
    </div>
  );
}

export default function WebsiteAnalytics() {
  const [days, setDays] =
    useState<AnalyticsRange>(7);

  const [live, setLive] =
    useState<LiveAnalytics | null>(null);

  const [liveVisitors, setLiveVisitors] =
    useState<LiveVisitor[]>([]);

  const [liveLoading, setLiveLoading] =
    useState(true);

  const [liveFetching, setLiveFetching] =
    useState(false);

  const [liveError, setLiveError] =
    useState<Error | null>(null);

  const [showAllProducts, setShowAllProducts] =
    useState(false);

  const [showAllPages, setShowAllPages] =
    useState(false);

  const {
    summary,
    topPages,
    topProducts,
    trend,
    funnel,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useWebsiteAnalytics(days);

  const fetchLiveAnalytics = async (background = false) => {
    if (background) {
      setLiveFetching(true);
    } else {
      setLiveLoading(true);
    }

    try {
      setLiveError(null);

      const [liveResult, visitorsResult] = await Promise.all([
        // Supabase client is intentionally imported here through the
        // existing project alias rather than changing your analytics hook.
        import("@/lib/supabase").then(({ supabase }) =>
          supabase.rpc("get_website_analytics_live")
        ),
        import("@/lib/supabase").then(({ supabase }) =>
          supabase.rpc("get_website_analytics_live_visitors", {
            p_limit: 25,
          })
        ),
      ]);

      if (liveResult.error) throw liveResult.error;
      if (visitorsResult.error) throw visitorsResult.error;

      /*
       * Supabase RPCs that use RETURNS TABLE return an array of rows.
       * get_website_analytics_live() returns exactly one row, so we
       * must read data[0]. Treating the whole array as the row causes
       * numeric fields to become undefined and display as NaN.
       */
      const liveRow =
        Array.isArray(liveResult.data)
          ? liveResult.data[0] ?? null
          : liveResult.data ?? null;

      setLive(liveRow as LiveAnalytics | null);
      setLiveVisitors((visitorsResult.data ?? []) as LiveVisitor[]);
    } catch (error) {
      setLiveError(
        error instanceof Error
          ? error
          : new Error("Unable to load live analytics.")
      );
    } finally {
      setLiveLoading(false);
      setLiveFetching(false);
    }
  };

  useEffect(() => {
    void fetchLiveAnalytics();

    const interval = window.setInterval(() => {
      void fetchLiveAnalytics(true);
    }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const stats = summary ?? {
    total_page_views: 0,
    unique_visitors: 0,
    unique_sessions: 0,
    product_views: 0,
  };

  const maxVisitors =
    Math.max(
      ...trend.map(
        (point) => point.unique_visitors
      ),
      1
    );

  const visibleProducts = showAllProducts
    ? topProducts
    : topProducts.slice(0, 4);

  const visiblePages = showAllPages
    ? topPages
    : topPages.slice(0, 4);

  return (
    <section className="space-y-5">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <TrendingUp className="h-4 w-4" />
            </div>

            <h2 className="text-lg font-semibold text-neutral-950">
              Website Analytics
            </h2>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Visitors, traffic and product interest across your storefront.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-neutral-200 bg-neutral-50 p-1">
            {([1, 7, 30] as AnalyticsRange[]).map(
              (range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setDays(range);
                    setShowAllProducts(false);
                    setShowAllPages(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    days === range
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-white"
                  }`}
                >
                  {rangeLabel(range)}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Refresh website analytics"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnalyticsInsights
        funnel={funnel}
        topPages={topPages}
        topProducts={topProducts}
        trend={trend}
        isLoading={isLoading}
        days={days}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            Unable to load website analytics.
          </p>

          <p className="mt-1 text-xs text-red-600">
            {error.message}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* =================================================
              LIVE NOW
          ================================================== */}

          <LiveNow
            live={live}
            visitors={liveVisitors}
            isLoading={liveLoading}
            isFetching={liveFetching}
            error={liveError}
            onRefresh={() => void fetchLiveAnalytics(true)}
          />

          {/* =================================================
              SUMMARY
          ================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Unique Visitors"
              value={
                isLoading
                  ? "—"
                  : formatNumber(
                      stats.unique_visitors
                    )
              }
              icon={Users}
              iconBgColor="bg-amber-50 text-amber-700"
            />

            <StatsCard
              title="Page Views"
              value={
                isLoading
                  ? "—"
                  : formatNumber(
                      stats.total_page_views
                    )
              }
              icon={Eye}
              iconBgColor="bg-blue-50 text-blue-700"
            />

            <StatsCard
              title="Sessions"
              value={
                isLoading
                  ? "—"
                  : formatNumber(
                      stats.unique_sessions
                    )
              }
              icon={FileText}
              iconBgColor="bg-violet-50 text-violet-700"
            />

            <StatsCard
              title="Product Views"
              value={
                isLoading
                  ? "—"
                  : formatNumber(
                      stats.product_views
                    )
              }
              icon={Gem}
              iconBgColor="bg-emerald-50 text-emerald-700"
            />
          </div>

          {/* =================================================
              CONVERSION FUNNEL
          ================================================== */}

          <ConversionFunnel
            funnel={funnel}
            isLoading={isLoading}
          />

          {/* =================================================
              VISITOR TREND
          ================================================== */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-950">
                  Visitor Trend
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  Unique visitors by day.
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-neutral-500 sm:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-950" />
                Visitors
              </div>
            </div>

            {isLoading ? (
              <div className="mt-6 h-56 animate-pulse rounded-xl bg-neutral-100" />
            ) : trend.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
                <p className="text-sm text-neutral-500">
                  No visitor data available for this period yet.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex h-56 items-end gap-1.5 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 px-2 pb-2 pt-5 sm:gap-3 sm:px-4">
                  {trend.map((point) => {
                    const height =
                      point.unique_visitors === 0
                        ? 2
                        : Math.max(
                            (point.unique_visitors /
                              maxVisitors) *
                              100,
                            5
                          );

                    return (
                      <div
                        key={point.date}
                        className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                      >
                        <div className="relative flex min-h-0 flex-1 items-end">
                          <div
                            title={`${formatDate(
                              point.date
                            )}: ${formatNumber(
                              point.unique_visitors
                            )} visitors`}
                            className="w-full rounded-t-md bg-neutral-950 transition hover:opacity-80"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        </div>

                        <div className="mt-2 text-center text-[9px] text-neutral-400 sm:text-[10px]">
                          {days === 1
                            ? "Today"
                            : formatDate(
                                point.date
                              )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-neutral-500">
                      Total Views
                    </p>
                    <p className="mt-1 font-semibold text-neutral-900">
                      {formatNumber(
                        stats.total_page_views
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-neutral-500">
                      Sessions
                    </p>
                    <p className="mt-1 font-semibold text-neutral-900">
                      {formatNumber(
                        stats.unique_sessions
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-neutral-500">
                      Product Views
                    </p>
                    <p className="mt-1 font-semibold text-neutral-900">
                      {formatNumber(
                        stats.product_views
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              PRODUCTS + PAGES
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-2">
            {/* =================================================
                MOST VIEWED PRODUCTS
            ================================================== */}

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-neutral-950">
                    Most Viewed Products
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    Products receiving the most attention.
                  </p>
                </div>

                {topProducts.length > 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllProducts(
                        (value) => !value
                      )
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    {showAllProducts
                      ? "Less"
                      : "More"}

                    {showAllProducts ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="mt-5 space-y-3">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-14 animate-pulse rounded-xl bg-neutral-100"
                      />
                    )
                  )}
                </div>
              ) : topProducts.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
                  <Gem className="mx-auto h-6 w-6 text-neutral-300" />

                  <p className="mt-2 text-sm text-neutral-500">
                    No product views recorded yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-5 space-y-2">
                    {visibleProducts.map(
                      (product, index) => (
                        <div
                          key={product.product_id}
                          className="flex items-start gap-3 rounded-xl border border-neutral-100 px-3 py-3 transition hover:bg-neutral-50"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-xs font-semibold text-white">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-medium leading-5 text-neutral-900">
                              {product.product_name ||
                                "Unnamed product"}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {formatNumber(
                                product.unique_visitors
                              )}{" "}
                              unique visitors
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-neutral-900">
                              {formatNumber(
                                product.views
                              )}
                            </p>

                            <p className="text-[11px] text-neutral-400">
                              views
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {topProducts.length > 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllProducts(
                          (value) => !value
                        )
                      }
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      {showAllProducts
                        ? "Show less"
                        : `View all ${topProducts.length} products`}

                      {showAllProducts ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* =================================================
                MOST VISITED PAGES
            ================================================== */}

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-neutral-950">
                    Most Visited Pages
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    Pages receiving the most traffic.
                  </p>
                </div>

                {topPages.length > 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllPages(
                        (value) => !value
                      )
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    {showAllPages
                      ? "Less"
                      : "More"}

                    {showAllPages ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="mt-5 space-y-3">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-12 animate-pulse rounded-xl bg-neutral-100"
                      />
                    )
                  )}
                </div>
              ) : topPages.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
                  <Eye className="mx-auto h-6 w-6 text-neutral-300" />

                  <p className="mt-2 text-sm text-neutral-500">
                    No page-view data available yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-5 overflow-hidden rounded-xl border border-neutral-100">
                    <div className="hidden grid-cols-[minmax(0,1fr)_80px_100px] border-b bg-neutral-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 sm:grid">
                      <span>Page</span>
                      <span className="text-right">
                        Views
                      </span>
                      <span className="text-right">
                        Visitors
                      </span>
                    </div>

                    {visiblePages.map(
                      (page, index) => (
                        <div
                          key={`${page.page_path}-${index}`}
                          className="grid gap-2 border-b border-neutral-100 px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_80px_100px] sm:items-start"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="break-all text-sm font-medium leading-5 text-neutral-900">
                              {page.page_path}
                            </p>
                          </div>

                          <div className="flex justify-between text-sm sm:block sm:text-right">
                            <span className="text-xs text-neutral-400 sm:hidden">
                              Views
                            </span>

                            <span className="font-semibold text-neutral-900">
                              {formatNumber(
                                page.views
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm sm:block sm:text-right">
                            <span className="text-xs text-neutral-400 sm:hidden">
                              Visitors
                            </span>

                            <span className="text-neutral-600">
                              {formatNumber(
                                page.unique_visitors
                              )}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {topPages.length > 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllPages(
                          (value) => !value
                        )
                      }
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      {showAllPages
                        ? "Show less"
                        : `View all ${topPages.length} pages`}

                      {showAllPages ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
