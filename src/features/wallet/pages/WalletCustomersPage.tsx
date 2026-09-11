import { useMemo, useState } from "react";
import {
  Search,
  Wallet,
  UserRound,
  Mail,
  Phone,
  Loader2,
  X,
} from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

import { useCustomers } from "@/features/customers/hooks/useCustomer";
import AdminCustomerWallet from "../components/AdminCustomerWallet";

export default function WalletCustomersPage() {
  const { data: customers = [], isLoading, isError } = useCustomers();

  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] =
    useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer: any) => {
      const name = [
        customer.first_name,
        customer.last_name,
      ]
        .filter(Boolean)
        .join(" ");

      return [
        name,
        customer.email,
        customer.phone,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });
  }, [customers, search]);

  const selectedCustomer = useMemo(
    () =>
      customers.find(
        (customer: any) =>
          customer.id === selectedCustomerId
      ),
    [customers, selectedCustomerId]
  );

  function clearSelection() {
    setSelectedCustomerId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Wallets"
        subtitle="Search customers and manage their T&M wallet."
      />

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-[#C8A44D]" />
                <h2 className="text-base font-semibold">
                  Select Customer
                </h2>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Search by customer name, email, or phone number.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customer..."
                className="h-11 w-full rounded-lg border bg-white pl-9 pr-9 text-sm outline-none transition focus:border-[#C8A44D] focus:ring-2 focus:ring-[#C8A44D]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-neutral-100 hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading customers...
            </div>
          </div>
        ) : isError ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium">
              Unable to load customers
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Please try again.
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <UserRound className="mx-auto h-8 w-8 text-neutral-300" />

            <p className="mt-3 text-sm font-medium">
              {search
                ? "No customers found"
                : "No customers available"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {search
                ? "Try a different name, email, or phone number."
                : "Customer accounts will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b bg-neutral-50/80">
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-6">
                      Customer
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Email
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Phone
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-6">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredCustomers.map((customer: any) => {
                    const name = [
                      customer.first_name,
                      customer.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ") || "Customer";

                    const isSelected =
                      customer.id === selectedCustomerId;

                    return (
                      <tr
                        key={customer.id}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-[#C8A44D]/[0.06]"
                            : "hover:bg-neutral-50"
                        }`}
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                              <UserRound className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {name}
                              </p>

                              <p className="mt-0.5 text-[10px] text-muted-foreground">
                                Customer
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="max-w-[220px] truncate">
                              {customer.email || "—"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {customer.phone || "—"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${
                              customer.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {customer.status || "unknown"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right sm:px-6">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              setSelectedCustomerId(customer.id)
                            }
                            className={
                              isSelected
                                ? "bg-neutral-900 text-white hover:bg-neutral-800"
                                : "bg-[#C8A44D] text-black hover:bg-[#D7B65D]"
                            }
                          >
                            <Wallet className="mr-1.5 h-3.5 w-3.5" />
                            {isSelected
                              ? "Selected"
                              : "Manage Wallet"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t px-5 py-3 sm:px-6">
              <p className="text-[11px] text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredCustomers.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {customers.length}
                </span>{" "}
                customers
              </p>
            </div>
          </>
        )}
      </section>

      {selectedCustomerId && selectedCustomer && (
        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">
                Wallet Management
              </h2>

              <p className="text-xs text-muted-foreground">
                {[
                  selectedCustomer.first_name,
                  selectedCustomer.last_name,
                ]
                  .filter(Boolean)
                  .join(" ") || "Customer"}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSelection}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Close Wallet
            </Button>
          </div>

          <AdminCustomerWallet
            customerId={selectedCustomerId}
          />
        </section>
      )}
    </div>
  );
}
