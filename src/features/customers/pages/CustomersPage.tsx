import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

import { useCustomers } from "../hooks/useCustomers";
import CustomerStats from "../components/CustomerStats";
import CustomersTable from "../components/CustomerTable";

export default function CustomersPage() {
  const navigate = useNavigate();

  const {
    data: customers = [],
    isLoading,
  } = useCustomers();

  return (
    <div className="space-y-6">

      <PageHeader
        title="Customers"
        subtitle="Manage your customers and view their purchase history."
        action={
          <Button
            onClick={() => navigate("/customers/new")}
          >
            Add Customer
          </Button>
        }
      />
<CustomerStats
    customers={customers}
/>

<CustomersTable
    customers={customers}
    isLoading={isLoading}
/>

    </div>
  );
}