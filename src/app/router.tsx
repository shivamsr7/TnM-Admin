import { createBrowserRouter, Navigate } from "react-router-dom";

import PublicRoute from "@/features/auth/components/PublicRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

import AdminLayout from "@/components/layout/AdminLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";

import CategoriesPage from "@/features/categories/pages/CategoriesPage";

import BrandsPage from "@/features/brands/pages/BrandsPage";
import AddBrandPage from "@/features/brands/pages/AddBrandPage";
import EditBrandPage from "@/features/brands/pages/EditBrandPage";

import ProductsPage from "@/features/products/pages/ProductsPage";
import AddProductPage from "@/features/products/pages/AddProductPage";
import EditProductPage from "@/features/products/pages/EditProductPage";
import CollectionsPage from "@/features/collections/pages/CollectionsPage";
import AddCollectionPage from "@/features/collections/pages/AddCollectionPage";
import EditCollectionPage from "@/features/collections/pages/EditCollectionPage";
import TagsPage from "@/features/tags/pages/TagsPage";
import AddTagPage from "@/features/tags/pages/AddTagPage";
import EditTagPage from "@/features/tags/pages/EditTagPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import OrderDetailsPage from "@/features/orders/pages/OrderDetailsPage";
import CouponsPage from "@/features/coupons/pages/CouponsPage";
import BannersPage from "@/features/banners/pages/BannersPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import HomepagePage from "@/features/homepage/pages/HomepagePage";
import HomepageSectionsPage from "@/features/homepage/sections/pages/HomepageSectionsPage";
import FeaturedCollectionsPage from "@/features/homepage/featured-collections/pages/FeaturedCollectionsPage";
import AnnouncementsPage from "@/features/announcements/pages/AnnouncementsPage";
import CustomersPage from "@/features/customers/pages/CustomersPage";
import CustomerDetailsPage from "@/features/customers/pages/CustomerDetailsPage";
import CreateCustomerPage from "@/features/customers/pages/CreateCustomerPage";
import EditCustomerPage from "@/features/customers/pages/EditCustomerPage";
import RewardsDashboardPage from "@/features/rewards/pages/RewardsDashboardPage"
import RewardRulesPage from "@/features/rewards/pages/RewardRulesPage";
import RewardTiersPage from "@/features/rewards/pages/RewardTiersPage";
import CustomerRewardsPage from "@/features/rewards/pages/CustomerRewardsPage";
import CustomerRewardDetailsPage from "@/features/rewards/pages/CustomerRewardDetailsPage";
import MembersPage from "@/features/membership/pages/MembersPage";
import MembershipDetailsPage from "@/features/membership/pages/MembershipDetailsPage";
import NotifyRequestsPage from "@/features/notify/pages/NotifyRequestsPage";
import ReviewsPage from "@/features/reviews/pages/ReviewsPage";
import FAQsPage from "@/features/faqs/pages/FAQsPage";
import PoliciesPage from "@/features/cms/pages/PoliciesPage";
import InstagramReviewsPage
  from "@/features/instagramReviews/pages/InstagramReviewsPage";
export const router = createBrowserRouter([
  // ---------------- Public Routes ----------------

  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },

  // ---------------- Protected Routes ----------------

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,

        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },

          // Dashboard

          {
            path: "dashboard",
            element: <DashboardPage />,
          },

          // Categories

          {
            path: "categories",
            element: <CategoriesPage />,
          },

          // Brands

          {
            path: "brands",
            element: <BrandsPage />,
          },
          {
            path: "brands/add",
            element: <AddBrandPage />,
          },
          {
            path: "brands/:id/edit",
            element: <EditBrandPage />,
          },
// Collections

{
  path: "collections",
  element: <CollectionsPage />,
},
{
  path: "collections/add",
  element: <AddCollectionPage />,
},
{
  path: "collections/:id/edit",
  element: <EditCollectionPage />,
},
// Tags

{
  path: "tags",
  element: <TagsPage />,
},
{
  path: "tags/add",
  element: <AddTagPage />,
},
{
  path: "tags/:id/edit",
  element: <EditTagPage />,
},
          // Products

          {
            path: "products",
            element: <ProductsPage />,
          },
          {
            path: "products/add",
            element: <AddProductPage />,
          },
          {
            path: "products/:id/edit",
            element: <EditProductPage />,
          },
          // Orders

{
  path: "orders",
  element: <OrdersPage />,
},
{
  path: "orders/:id",
  element: <OrderDetailsPage />,
},
// Coupons

{
  path: "coupons",
  element: <CouponsPage />,
},
{
  path: "banners",
  element: <BannersPage />,
},
{
  path: "settings",
  element: <SettingsPage />,
},
{
  path: "instagram-reviews",
  element: <InstagramReviewsPage />,
},
{
  path: "homepage",
  element: <HomepagePage />,
},
{
  path: "homepage/sections",
  element: <HomepageSectionsPage />,
},
{
  path: "homepage/featured-collections",
  element: <FeaturedCollectionsPage />,
},
{
  path: "announcements",
  element: <AnnouncementsPage />,
},
{
  path: "Customers",
  element: <CustomersPage />,
},
{
  path: "customers/new",
    element: <CreateCustomerPage />
},
{
  path: "customers/:id",
    element: <CustomerDetailsPage />,
},
{
  path: "customers/:id/edit",
    element: <EditCustomerPage />,
},
{
  path: "rewards",
  element: <RewardsDashboardPage />,
},
{
  path: "rewards/rules",
  element: <RewardRulesPage />,
},
{
  path: "rewards/tiers",
  element: <RewardTiersPage />,
},
{
  path: "rewards/customers",
  element: <CustomerRewardsPage />,
},
{
  path: "rewards/customers/:customerId",
  element: <CustomerRewardDetailsPage />,
},
{path: "/membership",
  element: <MembersPage />,
},
{path:"/membership/:customerId",
  element:<MembershipDetailsPage />},
  {
  path: "/notify",
  element: <NotifyRequestsPage />,
},
{
  path:"/reviews",
  element:<ReviewsPage />
},
{
  path: "/faqs",
  element: <FAQsPage />,
},
{
  path: "/policies",
  element: <PoliciesPage />,
},

        ],
      },
    ],
  },
]);