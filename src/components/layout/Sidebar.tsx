import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

import { menuItems } from "@/config/menu";
import AppLogo from "@/components/shared/AppLogo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const navLinks = (
    <nav className="space-y-2 p-4">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={20} />
            <span>{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:min-h-screen lg:flex-col lg:border-r lg:bg-white">
        <div className="border-b p-6">
          <AppLogo />
        </div>

        {navLinks}
      </aside>

      {/* Mobile / Tablet */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <AppLogo />

          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {navLinks}
      </aside>
    </>
  );
}