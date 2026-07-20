export interface RevenueStats {
  today: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

export interface OrdersStats {
  total: number;
  pending: number;
  confirmed: number;
  packed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  outOfStock: number;
  featured: number;
}

export interface CustomerStats {
  total: number;
}

export interface DashboardStats {
  revenue: RevenueStats;
  orders: OrdersStats;
  products: ProductStats;
  customers: CustomerStats;
}

export interface SalesChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  order_status: string;
  created_at: string;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  product_image: string | null;
  total_quantity: number;
  total_sales: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
  low_stock_threshold: number;
  price: number;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  salesChart: SalesChartPoint[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
}

export type SalesPeriod = 7 | 30 | 90;

export interface SalesChartData {
  date: string;
  revenue: number;
  deliveredRevenue: number;
  orders: number;
}

export interface SalesSummary {
  grossRevenue: number;
  deliveredRevenue: number;
  totalOrders: number;
}
export interface SalesChartResponse {
  chart: SalesChartData[];
  summary: SalesSummary;
}
export interface TopProduct {
  id: string;
  name: string;
  image: string | null;
  price: number;
  totalSold: number;
  revenue: number;
  stock: number;
}
export interface Activity {
  id: string;
  type:
    | "order"
    | "customer"
    | "product"
    | "coupon"
    | "banner";

  title: string;
  description: string;
  createdAt: string;
  route: string;
}