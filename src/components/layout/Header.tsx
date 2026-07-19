import {
  Bell,
  LogOut,
  Menu,
  Search,
  UserCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authService } from "@/features/auth/services/auth.service";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    const { error } = await authService.logout();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  }

  const pageTitle =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile / Tablet Menu */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <h2 className="text-lg font-semibold sm:text-xl">
          {pageTitle}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search - hide on very small screens */}
        <button className="hidden rounded-lg p-2 hover:bg-gray-100 sm:flex">
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>

        {/* User */}
        <button className="rounded-full p-1 hover:bg-gray-100">
          <UserCircle className="h-8 w-8 text-gray-700" />
        </button>

        {/* Desktop Logout */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="hidden lg:flex"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

        {/* Mobile Logout */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          className="lg:hidden"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}