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
import CustomerQueriesPage from "@/features/customerQueries/pages/CustomerQueriesPage";
import CustomerDetailsPage from "@/features/customers/pages/CustomerDetailsPage";
import CreateCustomerPage from "@/features/customers/pages/CreateCustomerPage";
import EditCustomerPage from "@/features/customers/pages/EditCustomerPage";

import RewardsDashboardPage from "@/features/rewards/pages/RewardsDashboardPage";
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

import InstagramReviewsPage from "@/features/instagramReviews/pages/InstagramReviewsPage";

import CollaboratorsPage from "@/features/collaborators/pages/CollaboratorsPage";

import WalletCustomersPage from "@/features/wallet/pages/WalletCustomersPage";
import WalletSettingsPage from "@/features/wallet/pages/WalletSettingsPage";
import WalletDashboardPage from "@/features/wallet/pages/WalletDashboardPage";

import AdminCourierRateChecker from "@/features/shipping/components/AdminCourierRateChecker";

/*
 * ============================================================
 * PLAY & EARN ADMIN
 * ============================================================
 *
 * These pages are intentionally kept separate from the regular
 * Wallet and Rewards modules.
 */

import PlayEarnAdminDashboardPage
  from "@/features/playEarnAdmin/pages/PlayEarnAdminDashboardPage";

import PlayEarnGameSettingsPage
  from "@/features/playEarnAdmin/pages/PlayEarnGameSettingsPage";

import PlayEarnWalletCustomersPage
  from "@/features/playEarnAdmin/pages/PlayEarnWalletCustomersPage";

import PlayEarnCheckoutSettingsPage
  from "@/features/playEarnAdmin/pages/PlayEarnCheckoutSettingsPage";

export const router = createBrowserRouter([
  // ============================================================
  // PUBLIC ROUTES
  // ============================================================

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

  // ============================================================
  // PROTECTED ADMIN ROUTES
  // ============================================================

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

          // ======================================================
          // DASHBOARD
          // ======================================================

          {
            path: "dashboard",
            element: <DashboardPage />,
          },

          // ======================================================
          // CATEGORIES
          // ======================================================

          {
            path: "categories",
            element: <CategoriesPage />,
          },

          // ======================================================
          // BRANDS
          // ======================================================

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

          // ======================================================
          // COLLECTIONS
          // ======================================================

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

          // ======================================================
          // TAGS
          // ======================================================

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

          // ======================================================
          // PRODUCTS
          // ======================================================

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

          // ======================================================
          // ORDERS
          // ======================================================

          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "orders/:id",
            element: <OrderDetailsPage />,
          },

          // ======================================================
          // COUPONS
          // ======================================================

          {
            path: "coupons",
            element: <CouponsPage />,
          },

          // ======================================================
          // BANNERS
          // ======================================================

          {
            path: "banners",
            element: <BannersPage />,
          },

          // ======================================================
          // SETTINGS
          // ======================================================

          {
            path: "settings",
            element: <SettingsPage />,
          },

          // ======================================================
          // INSTAGRAM REVIEWS
          // ======================================================

          {
            path: "instagram-reviews",
            element: <InstagramReviewsPage />,
          },

          // ======================================================
          // HOMEPAGE
          // ======================================================

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

          // ======================================================
          // ANNOUNCEMENTS
          // ======================================================

          {
            path: "announcements",
            element: <AnnouncementsPage />,
          },

          // ======================================================
          // CUSTOMERS
          // ======================================================

          {
            path: "customers",
            element: <CustomersPage />,
          },
          {
            path: "customer-queries",
            element: <CustomerQueriesPage />,
          },
          {
            path: "collaborators",
            element: <CollaboratorsPage />,
          },
          {
            path: "customers/new",
            element: <CreateCustomerPage />,
          },
          {
            path: "customers/:id",
            element: <CustomerDetailsPage />,
          },
          {
            path: "customers/:id/edit",
            element: <EditCustomerPage />,
          },

          // ======================================================
          // SHIPPING — ADMIN COURIER RATE CHECKER
          // ======================================================

          {
            path: "courier-rates",
            element: <AdminCourierRateChecker />,
          },

          // ======================================================
          // REGULAR WALLET
          // ======================================================

          {
            path: "wallet",
            element: <WalletDashboardPage />,
          },
          {
            path: "wallet/customers",
            element: <WalletCustomersPage />,
          },
          {
            path: "wallet/settings",
            element: <WalletSettingsPage />,
          },

          // ======================================================
          // PLAY & EARN ADMIN
          // ======================================================

          {
            path: "play-earn-admin",
            element: <PlayEarnAdminDashboardPage />,
          },

          {
            path: "play-earn-admin/games",
            element: <PlayEarnGameSettingsPage />,
          },

          {
            path: "play-earn-admin/wallets",
            element: <PlayEarnWalletCustomersPage />,
          },

          {
            path: "play-earn-admin/checkout",
            element: <PlayEarnCheckoutSettingsPage />,
          },

          // ======================================================
          // REWARDS
          // ======================================================

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

          // ======================================================
          // MEMBERSHIP
          // ======================================================

          {
            path: "membership",
            element: <MembersPage />,
          },
          {
            path: "membership/:customerId",
            element: <MembershipDetailsPage />,
          },

          // ======================================================
          // NOTIFY
          // ======================================================

          {
            path: "notify",
            element: <NotifyRequestsPage />,
          },

          // ======================================================
          // REVIEWS
          // ======================================================

          {
            path: "reviews",
            element: <ReviewsPage />,
          },

          // ======================================================
          // CMS
          // ======================================================

          {
            path: "faqs",
            element: <FAQsPage />,
          },
          {
            path: "policies",
            element: <PoliciesPage />,
          },
        ],
      },
    ],
  },
]);