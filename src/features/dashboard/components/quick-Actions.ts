import {
  Package,
  ShoppingBag,
  Users,
  Tags,
  TicketPercent,
  Image,
  Settings,
  BarChart3,
} from "lucide-react";

export const quickActions = [
  {
    title: "Add Product",
    icon: Package,
    path: "/products/add",
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    path: "/orders",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    title: "Categories",
    icon: Tags,
    path: "/categories",
  },
  {
    title: "Coupons",
    icon: TicketPercent,
    path: "/coupons",
  },
  {
    title: "Banners",
    icon: Image,
    path: "/banners",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
];