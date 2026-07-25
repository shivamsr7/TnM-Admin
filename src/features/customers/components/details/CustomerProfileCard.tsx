import StatusBadge from "@/components/shared/StatusBadge";

import type { Customer } from "../../types/customer.types";

interface Props {
  customer: Customer;
}

export default function CustomerProfileCard({
  customer,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-bold">
          {customer.first_name.charAt(0)}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {customer.first_name} {customer.last_name}
          </h2>

          <p className="text-muted-foreground">
            {customer.email || "No email"}
          </p>

          <p className="text-muted-foreground">
            {customer.phone}
          </p>

          <div className="mt-3">
            <StatusBadge status={customer.status} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Joined
          </p>

          <p className="font-medium">
            {new Date(customer.created_at).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Last Login
          </p>

          <p className="font-medium">
            {customer.last_login_at
              ? new Date(
                  customer.last_login_at
                ).toLocaleDateString()
              : "Never"}
          </p>
        </div>
      </div>
    </div>
  );
}