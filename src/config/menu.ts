import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Layers3,
  Tags,
  ShoppingCart,
  Users,
  TicketPercent,
  Image,
  Settings,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Categories",
    path: "/categories",
    icon: FolderTree,
  },

  {
    title: "Brands",
    path: "/brands",
    icon: Tag,
  },

  {
    title: "Collections",
    path: "/collections",
    icon: Layers3,
  },

  {
    title: "Tags",
    path: "/tags",
    icon: Tags,
  },

  {
    title: "Products",
    path: "/products",
    icon: Package,
  },

  {
    title: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },

  {
    title: "Customers",
    path: "/customers",
    icon: Users,
  },

  {
    title: "Coupons",
    path: "/coupons",
    icon: TicketPercent,
  },

  {
    title: "Banners",
    path: "/banners",
    icon: Image,
  },

  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];