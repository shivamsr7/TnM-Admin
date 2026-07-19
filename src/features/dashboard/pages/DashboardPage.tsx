import StatsCard from "@/features/dashboard/components/StatsCard";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import AppLogo from "@/assets/logo.png";
export default function Dashboard() {
  return (
    <div>
<PageTitle
  title={
    <img
      src={AppLogo}
      alt="TnM Jewels"
      className="h-14 w-auto object-contain"
    />
  }
  subtitle="Welcome back to TnM Admin Page."
/>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Products"
          value={0}
          icon={Package}
          iconBgColor="bg-blue-100"
        />

        <StatsCard
          title="Orders"
          value={0}
          icon={ShoppingCart}
          iconBgColor="bg-green-100"
        />

        <StatsCard
          title="Customers"
          value={0}
          icon={Users}
          iconBgColor="bg-yellow-100"
        />

        <StatsCard
          title="Revenue"
          value="₹0"
          icon={IndianRupee}
          iconBgColor="bg-purple-100"
        />
      </div>
    </div>
  );
}