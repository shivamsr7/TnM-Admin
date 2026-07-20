import { supabase } from "@/lib/supabase";
import type {
  DashboardStats,
  RecentOrder,
  SalesChartResponse,
  SalesChartData,
} from "../types/dashboard.types";

class DashboardService {


  // ============================
  // Dashboard Statistics
  // ============================

  async getDashboardStats(): Promise<DashboardStats> {
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



  // ============================
  // Recent Orders
  // ============================

  async getRecentOrders(): Promise<RecentOrder[]> {
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



  // ============================
  // Low Stock
  // ============================

 
async getSalesChart(
  period: 7 | 30 | 90
): Promise<SalesChartResponse> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  const { data, error } = await supabase
    .from("orders")
    .select(`
      created_at,
      total_amount,
      order_status
    `)
    .gte("created_at", startDate.toISOString())
    .order("created_at");

  if (error) throw error;

  const grouped = new Map<
    string,
    SalesChartData
  >();

  let grossRevenue = 0;
  let deliveredRevenue = 0;
  let totalOrders = 0;

  (data ?? []).forEach((order) => {
    const date = new Date(order.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!grouped.has(date)) {
      grouped.set(date, {
        date,
        revenue: 0,
        deliveredRevenue: 0,
        orders: 0,
      });
    }

    const current = grouped.get(date)!;

    if (
      order.order_status !== "cancelled" &&
      order.order_status !== "returned"
    ) {
      const amount = Number(order.total_amount);

      current.revenue += amount;
      grossRevenue += amount;
    }

    if (order.order_status === "delivered") {
      const amount = Number(order.total_amount);

      current.deliveredRevenue += amount;
      deliveredRevenue += amount;
    }

    current.orders += 1;
    totalOrders += 1;
  });

  return {
    chart: Array.from(grouped.values()),

    summary: {
      grossRevenue,
      deliveredRevenue,
      totalOrders,
    },
  };
}
  
}

export const dashboardService = new DashboardService();