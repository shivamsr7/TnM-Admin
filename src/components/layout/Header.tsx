import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  UserCircle,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your store",
  },
  "/products": {
    title: "Products",
    subtitle: "Manage your jewellery catalog",
  },
  "/orders": {
    title: "Orders",
    subtitle: "Track and manage customer orders",
  },
  "/customers": {
    title: "Customers",
    subtitle: "View and manage your customers",
  },
  "/customer-queries": {
    title: "Customer Queries",
    subtitle: "Manage support tickets and enquiries",
  },
};

function getPageMeta(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];

  const match = Object.keys(pageTitles).find(
    (path) => path !== "/dashboard" && pathname.startsWith(`${path}/`)
  );

  return (
    (match && pageTitles[match]) || {
      title: "T&M Admin",
      subtitle: "Manage your store",
    }
  );
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { title, subtitle } = getPageMeta(location.pathname);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? "");
    });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;

    // Keep this lightweight and non-invasive. Pages can later consume
    // ?search= without changing the admin shell.
    navigate(`/customers?search=${encodeURIComponent(value)}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            T&M Jewels · Admin
          </p>
          <div className="mt-0.5 flex min-w-0 items-baseline gap-2">
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
              {title}
            </h1>
            <span className="hidden truncate text-xs text-slate-400 md:block">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5 sm:gap-2">
          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="absolute right-0 top-12 z-50 flex w-[min(86vw,360px)] items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:static sm:w-[260px] sm:rounded-xl sm:shadow-none"
            >
              <Search size={18} className="ml-2 shrink-0 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers, orders..."
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearch("");
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close search"
              >
                <X size={17} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-expanded={profileOpen}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white">
                <UserCircle size={18} />
              </span>
              <span className="hidden max-w-[150px] text-left sm:block">
                <span className="block text-xs font-semibold text-slate-800">
                  Administrator
                </span>
                <span className="block truncate text-[10px] text-slate-400">
                  {email || "Admin account"}
                </span>
              </span>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>

            {profileOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  aria-label="Close account menu"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="text-xs font-semibold text-slate-900">Administrator</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {email || "Signed in"}
                    </p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Account settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
