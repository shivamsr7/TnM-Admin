import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  X,
} from "lucide-react";

import { menuItems } from "@/config/menu";
import AppLogo from "@/components/shared/AppLogo";

type MenuChild = {
  title: string;
  path?: string;
  icon?: LucideIcon;
};

type MenuItem = {
  title: string;
  path?: string;
  icon?: LucideIcon;
  children?: MenuChild[];
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const groupMatchers: Record<string, string[]> = {
  Catalog: [
    "Categories",
    "Brands",
    "Collections",
    "Tags",
    "Products",
  ],
  Sales: [
    "Orders",
    "Customers",
    "Wallet",
    "Coupons",
  ],
  "Customer Experience": [
    "Customer Queries",
    "Reviews",
    "Instagram Reviews",
    "Collaborators",
    "Membership",
    "Rewards",
    "Notify Requests",
  ],
  Content: [
    "Homepage",
    "Homepage Sections",
    "Featured Collections",
    "Announcements",
    "CMS",
    "FAQs",
    "Policies",
    "Banners",
  ],
  System: ["Settings"],
};

function findGroup(title: string) {
  return (
    Object.entries(groupMatchers).find(([, titles]) => titles.includes(title))?.[0] ||
    "More"
  );
}

function hasActiveChild(item: MenuItem, pathname: string) {
  return Boolean(
    item.children?.some(
      (child) => child.path && pathname.startsWith(child.path)
    )
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string[]>([]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};

    for (const item of menuItems) {
      const group = findGroup(item.title);
      groups[group] ??= [];
      groups[group].push(item);
    }

    // Keep Customer Queries available even if an older menu.ts has not yet
    // been updated. It will not be duplicated when it already exists.
    const alreadyHasQueries = menuItems.some(
      (item) => item.title === "Customer Queries"
    );

    if (!alreadyHasQueries) {
      groups["Customer Experience"] ??= [];
      groups["Customer Experience"].unshift({
        title: "Customer Queries",
        path: "/customer-queries",
        icon: MessageSquare,
      });
    }

    return groups;
  }, []);

  useEffect(() => {
    const activeParents = Object.values(groupedItems)
      .flat()
      .filter((item) => hasActiveChild(item, location.pathname))
      .map((item) => item.title);

    setExpanded((current) => Array.from(new Set([...current, ...activeParents])));
  }, [groupedItems, location.pathname]);

  const toggle = (title: string) => {
    setExpanded((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title]
    );
  };

  const renderItem = (item: MenuItem) => {
    const Icon = item.icon || HelpCircle;
    const hasChildren = Boolean(item.children?.length);
    const isOpen = expanded.includes(item.title);
    const childActive = hasActiveChild(item, location.pathname);

    if (hasChildren) {
      return (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => toggle(item.title)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
              childActive
                ? "bg-slate-100 text-slate-950"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                childActive
                  ? "bg-white text-slate-950 shadow-sm"
                  : "bg-transparent text-slate-400 group-hover:text-slate-700"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
            {isOpen ? (
              <ChevronDown size={15} className="text-slate-400" />
            ) : (
              <ChevronRight size={15} className="text-slate-400" />
            )}
          </button>

          {isOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-4">
              {item.children?.map((child) => {
                if (!child.path) return null;

                return (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-xs font-medium transition ${
                        isActive
                          ? "bg-slate-950 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {child.title}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (!item.path) return null;

    return (
      <NavLink
        key={item.title}
        to={item.path}
        end={item.path === "/dashboard" || item.path === "/"}
        onClick={onClose}
        className={({ isActive }) =>
          `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
            isActive
              ? "bg-slate-950 text-white shadow-[0_6px_18px_rgba(15,23,42,0.14)]"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                isActive
                  ? "bg-white/10 text-white"
                  : "bg-transparent text-slate-400 group-hover:text-slate-700"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
          </>
        )}
      </NavLink>
    );
  };

  const content = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-[88px] shrink-0 items-center border-b border-slate-200/80 px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AppLogo />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-slate-950">
              T&M Jewels
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Admin Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) =>
            `mb-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
              isActive
                ? "bg-slate-950 text-white shadow-[0_6px_18px_rgba(15,23,42,0.14)]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <LayoutDashboard size={17} strokeWidth={1.8} />
          </span>
          Dashboard
        </NavLink>

        <div className="space-y-5">
          {Object.entries(groupedItems).map(([group, items]) => (
            <section key={group}>
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {group}
              </p>
              <div className="space-y-0.5">
                {items
                  .filter((item) => item.title !== "Dashboard")
                  .map(renderItem)}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200/80 p-3">
        <button
          type="button"
          onClick={async () => {
            await import("@/lib/supabase").then(({ supabase }) =>
              supabase.auth.signOut()
            );
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <LogOut size={16} />
          </span>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[272px] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
