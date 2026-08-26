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
  LayoutTemplate,
  Megaphone,
  Gift,
  Crown,
  Bell,
  MessageSquare,
  HelpCircle,
  FileText,
  MessageCircle
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
 {
  title: "Homepage",
  path: "/homepage",
  icon: LayoutTemplate,
},

{
  title: "Instagram Reviews",
  path: "/instagram-reviews",
  icon: MessageCircle,
},

{
  title: "Homepage Sections",
  path: "/homepage/sections",
  icon: LayoutTemplate,
},

{
  title: "Featured Collections",
  path: "/homepage/featured-collections",
  icon: Layers3,
},
{
  title: "Announcements",
  path: "/announcements",
  icon: Megaphone,
},
{
  title: "Membership",
  path: "/membership",
  icon: Crown,
  
},
{
  title: "Reviews",
  path: "/reviews",
  icon: MessageSquare,
},
{
  title: "Rewards",
  path: "/rewards",
  icon: Gift,

  children: [
    {
      title: "Dashboard",
      path: "/rewards",
    },
    {
      title: "Reward Rules",
      path: "/rewards/rules",
    },
    {
      title: "Reward Tiers",
      path: "/rewards/tiers",
    },
    {
  title: "Customer Rewards",
  path: "/rewards/customers",
},
{
  title: "Notify Requests",
  path: "/notify",
  icon: Bell,
},
  ],
  
},
{
  title: "CMS",
  icon: FileText,

  children: [
    {
      title: "FAQs",
      path: "/faqs",
      icon: HelpCircle,
    },

    {
      title: "Policies",
      path: "/policies",
      icon: FileText,
    },
  ],
}
];