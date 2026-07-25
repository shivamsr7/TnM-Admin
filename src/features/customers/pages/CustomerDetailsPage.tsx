import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import CustomerReferralSection from "@/features/customers/referrals/components/CustomerReferralSection";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

import { useCustomer } from "../hooks/useCustomer";
import CustomerAddresses from "@/features/customers/addresses/components/CustomerAddresses";
import CustomerProfileCard from "../components/details/CustomerProfileCard";
import CustomerStatsCards from "../components/details/CustomerStatsCards";
import CustomerNotesCard from "../components/details/CustomerNotesCard";
import CustomerOrdersTable from "../components/details/CustomerOrdersTable";
import CustomerRewardsSection
from "@/features/rewards/components/CustomerRewardsSection";
import {
  useCustomerOrders
} from "../hooks/useCustomerOrders";

export default function CustomerDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const {
    data: customer,
    isLoading,
    isError,
  } = useCustomer(id!);
const {
  data: orders = [],
} = useCustomerOrders(id!);
  const analytics = useMemo(() => {
  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );

  const averageOrderValue =
    totalOrders > 0
      ? totalSpent / totalOrders
      : 0;

  const lastOrder =
    totalOrders > 0
      ? new Date(orders[0].created_at).toLocaleDateString()
      : null;

  return {
    totalOrders,
    totalSpent,
    averageOrderValue,
    lastOrder,
  };
}, [orders]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">
          Customer not found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The customer you're looking for doesn't exist.
        </p>

        <Button
          className="mt-6"
          onClick={() => navigate("/customers")}
        >
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-4 px-0"
            asChild
          >
            <Link to="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>

          <h1 className="text-3xl font-bold">
            {customer.first_name} {customer.last_name}
          </h1>

          <p className="mt-1 text-muted-foreground">
            Customer Details
          </p>
        </div>

        <Button asChild>
          <Link to={`/customers/${customer.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Customer
          </Link>
        </Button>
      </div>

      {/* Analytics */}

      <CustomerStatsCards
        analytics={analytics}
      />

      {/* Profile + Notes */}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CustomerProfileCard
            customer={customer}
          />
        </div>

        <CustomerNotesCard
          notes={customer.notes}
        />
      </div>

      {/* Orders */}

      <CustomerRewardsSection
    customerId={customer.id}
/>
<CustomerReferralSection
  customerId={customer.id}
/>
{/* Saved Addresses */}

<CustomerAddresses
    customerId={customer.id}
/>
<CustomerOrdersTable
    orders={orders.map(order => ({
        id: order.id,
        order_number: order.order_number,
        created_at: order.created_at,
        total: order.total_amount,
        payment_status: order.advance_payment_status,
        order_status: order.order_status,
    }))}
/>
    </div>
  );
}