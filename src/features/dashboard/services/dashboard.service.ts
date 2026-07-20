import { supabase } from "@/lib/supabase";
import type {
  DashboardData,
  DashboardStats,
  SalesChartPoint,
  RecentOrder,
  TopProduct,
  LowStockProduct,
} from "../types/dashboard.types";

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    const [
      stats,
      salesChart,
      recentOrders,
      topProducts,
      lowStockProducts,
    ] = await Promise.all([
      this.getStats(),
      this.getSalesChart(),
      this.getRecentOrders(),
      this.getTopProducts(),
      this.getLowStockProducts(),
    ]);

    return {
      stats,
      salesChart,
      recentOrders,
      topProducts,
      lowStockProducts,
    };
  }

  // ============================
  // Dashboard Statistics
  // ============================

  private async getStats(): Promise<DashboardStats> {
    const [{ data: orders }, { data: products }] = await Promise.all([
      supabase.from("orders").select("*"),
      supabase.from("products").select("*"),
    ]);

    const orderList = orders ?? [];
    const productList = products ?? [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayThisMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const firstDayLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    const lastDayLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59
    );

    const deliveredOrders = orderList.filter(
      (o) => o.order_status === "delivered"
    );

    const todayRevenue = deliveredOrders
      .filter((o) => new Date(o.created_at) >= today)
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const thisMonthRevenue = deliveredOrders
      .filter((o) => new Date(o.created_at) >= firstDayThisMonth)
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const lastMonthRevenue = deliveredOrders
      .filter((o) => {
        const d = new Date(o.created_at);
        return d >= firstDayLastMonth && d <= lastDayLastMonth;
      })
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const growth =
      lastMonthRevenue === 0
        ? 0
        : ((thisMonthRevenue - lastMonthRevenue) /
            lastMonthRevenue) *
          100;

    const uniqueCustomers = new Set(
      orderList.map((o) => o.customer_phone)
    );

    return {
      revenue: {
        today: todayRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth,
      },

      orders: {
        total: orderList.length,
        pending: orderList.filter((o) => o.order_status === "pending").length,
        confirmed: orderList.filter((o) => o.order_status === "confirmed").length,
        packed: orderList.filter((o) => o.order_status === "packed").length,
        shipped: orderList.filter((o) => o.order_status === "shipped").length,
        delivered: orderList.filter((o) => o.order_status === "delivered").length,
        cancelled: orderList.filter((o) => o.order_status === "cancelled").length,
        returned: orderList.filter((o) => o.order_status === "returned").length,
      },

      products: {
        total: productList.length,
        active: productList.filter((p) => p.status === "active").length,
        draft: productList.filter((p) => p.status === "draft").length,
        outOfStock: productList.filter((p) => p.stock <= 0).length,
        featured: productList.filter((p) => p.featured).length,
      },

      customers: {
        total: uniqueCustomers.size,
      },
    };
  }

  // ============================
  // Sales Chart
  // ============================

  private async getSalesChart(): Promise<SalesChartPoint[]> {
    return [];
  }

  // ============================
  // Recent Orders
  // ============================

  private async getRecentOrders(): Promise<RecentOrder[]> {
    const { data } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        customer_name,
        customer_phone,
        total_amount,
        payment_method,
        order_status,
        created_at
      `
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    return (data ?? []) as RecentOrder[];
  }

  // ============================
  // Top Products
  // ============================

  private async getTopProducts(): Promise<TopProduct[]> {
    return [];
  }

  // ============================
  // Low Stock
  // ============================

  private async getLowStockProducts(): Promise<LowStockProduct[]> {
    const { data } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        stock,
        low_stock_threshold,
        price,
        status
      `
      )
      .eq("status", "active")
      .order("stock")
      .limit(5);

    return ((data ?? []).filter(
      (p) => p.stock <= p.low_stock_threshold
    )) as LowStockProduct[];
  }
}

export const dashboardService = new DashboardService();