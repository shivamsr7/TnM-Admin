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
        ],
      },
    ],
  },
]);