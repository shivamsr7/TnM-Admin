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
import AdminCustomerWallet from "@/features/wallet/components/AdminCustomerWallet";
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
        <div className="xl:col-span-2 space-y-4">
          <CustomerProfileCard
            customer={customer}
          />

          {/* Date of Birth */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>

                <p className="mt-1 text-base font-semibold">
                  {customer.date_of_birth
                    ? (() => {
                        const [year, month, day] =
                          customer.date_of_birth.split("-");

                        return `${day}/${month}/${year}`;
                      })()
                    : "Not added"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">
                  Changes Used
                </p>

                <p className="mt-1 text-base font-semibold">
                  {customer.date_of_birth_update_count ?? 0}/2
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {(
                customer.date_of_birth_update_count ?? 0
              ) >= 2
                ? "Date of birth can no longer be changed by the customer."
                : "Customer can update their date of birth up to 2 times."}
            </p>
          </div>
        </div>

        <CustomerNotesCard
          notes={customer.notes}
        />
      </div>
{/* T&M Wallet */}

<AdminCustomerWallet
  customerId={customer.id}
/>
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