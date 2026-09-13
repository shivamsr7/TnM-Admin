import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AnalyticsRange = 1 | 7 | 30;

export interface AnalyticsSummary {
  total_page_views: number;
  unique_visitors: number;
  unique_sessions: number;
  product_views: number;
}

export interface AnalyticsTopPage {
  page_path: string;
  views: number;
  unique_visitors: number;
}

export interface AnalyticsTopProduct {
  product_id: string;
  product_name: string | null;
  views: number;
  unique_visitors: number;
}

export interface AnalyticsTrendPoint {
  date: string;
  page_views: number;
  unique_visitors: number;
  sessions: number;
  product_views: number;
}

export interface AnalyticsFunnel {
  unique_visitors: number;
  product_viewers: number;
  add_to_cart_users: number;
  checkout_users: number;
  purchasers: number;
}

interface UseWebsiteAnalyticsResult {
  summary: AnalyticsSummary | null;
  topPages: AnalyticsTopPage[];
  topProducts: AnalyticsTopProduct[];
  trend: AnalyticsTrendPoint[];
  funnel: AnalyticsFunnel | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const EMPTY_SUMMARY: AnalyticsSummary = {
  total_page_views: 0,
  unique_visitors: 0,
  unique_sessions: 0,
  product_views: 0,
};

const EMPTY_FUNNEL: AnalyticsFunnel = {
  unique_visitors: 0,
  product_viewers: 0,
  add_to_cart_users: 0,
  checkout_users: 0,
  purchasers: 0,
};

export function useWebsiteAnalytics(
  days: AnalyticsRange = 7
): UseWebsiteAnalyticsResult {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topPages, setTopPages] = useState<AnalyticsTopPage[]>([]);
  const [topProducts, setTopProducts] = useState<AnalyticsTopProduct[]>([]);
  const [trend, setTrend] = useState<AnalyticsTrendPoint[]>([]);
  const [funnel, setFunnel] = useState<AnalyticsFunnel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      const [summaryResult, pagesResult, productsResult, trendResult, funnelResult] =
        await Promise.all([
          supabase.rpc("get_website_analytics_summary", { p_days: days }),
          supabase.rpc("get_website_analytics_top_pages", {
            p_days: days,
            p_limit: 8,
          }),
          supabase.rpc("get_website_analytics_top_products", {
            p_days: days,
            p_limit: 8,
          }),
          supabase.rpc("get_website_analytics_trend", { p_days: days }),
          supabase.rpc("get_website_analytics_funnel", { p_days: days }),
        ]);

      if (summaryResult.error) throw summaryResult.error;
      if (pagesResult.error) throw pagesResult.error;
      if (productsResult.error) throw productsResult.error;
      if (trendResult.error) throw trendResult.error;
      if (funnelResult.error) throw funnelResult.error;

      const nextSummary =
        (summaryResult.data?.[0] as AnalyticsSummary | undefined) ??
        EMPTY_SUMMARY;

      setSummary({
        total_page_views: Number(nextSummary.total_page_views ?? 0),
        unique_visitors: Number(nextSummary.unique_visitors ?? 0),
        unique_sessions: Number(nextSummary.unique_sessions ?? 0),
        product_views: Number(nextSummary.product_views ?? 0),
      });

      setTopPages(
        ((pagesResult.data ?? []) as AnalyticsTopPage[]).map((page) => ({
          page_path: page.page_path,
          views: Number(page.views ?? 0),
          unique_visitors: Number(page.unique_visitors ?? 0),
        }))
      );

      setTopProducts(
        ((productsResult.data ?? []) as AnalyticsTopProduct[]).map((product) => ({
          product_id: product.product_id,
          product_name: product.product_name ?? null,
          views: Number(product.views ?? 0),
          unique_visitors: Number(product.unique_visitors ?? 0),
        }))
      );

      setTrend(
        ((trendResult.data ?? []) as AnalyticsTrendPoint[]).map((point) => ({
          date: point.date,
          page_views: Number(point.page_views ?? 0),
          unique_visitors: Number(point.unique_visitors ?? 0),
          sessions: Number(point.sessions ?? 0),
          product_views: Number(point.product_views ?? 0),
        }))
      );

      const nextFunnel =
        (funnelResult.data?.[0] as AnalyticsFunnel | undefined) ??
        EMPTY_FUNNEL;

      setFunnel({
        unique_visitors: Number(nextFunnel.unique_visitors ?? 0),
        product_viewers: Number(nextFunnel.product_viewers ?? 0),
        add_to_cart_users: Number(nextFunnel.add_to_cart_users ?? 0),
        checkout_users: Number(nextFunnel.checkout_users ?? 0),
        purchasers: Number(nextFunnel.purchasers ?? 0),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to load website analytics.")
      );
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    summary,
    topPages,
    topProducts,
    trend,
    funnel,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
