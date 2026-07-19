import type { ReactNode } from "react";
import logo from "@/assets/logo.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50 to-orange-100 px-4 py-6">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-5 shadow-xl sm:max-w-md sm:p-6 md:max-w-md md:p-8">
        {/* Logo */}
        <div className="mb-6 text-center">
          <img
            src={logo}
            alt="TnM Jewels"
            className="mx-auto h-14 w-auto object-contain sm:h-16 md:h-20"
          />

          <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            Admin Login
          </h1>

          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Sign in to manage your store
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}