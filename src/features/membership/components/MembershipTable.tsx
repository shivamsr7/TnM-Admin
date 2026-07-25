import { Badge } from "@/components/ui/badge";
import DataTable, {
  type Column,
} from "@/components/shared/DataTable";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Membership } from "../types";
import {Button} from "@/components/ui/button"
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const columns: Column<Membership>[] = [
  {
    key: "customer_name",
    title: "Customer",
  },
  {
    key: "tier_name",
    title: "Tier",
    render: (_value, row) => (
      <Badge
        style={{
          backgroundColor: row.badge_color,
          color: "#fff",
        }}
      >
        {row.tier_name}
      </Badge>
    ),
  },
  {
    key: "current_points",
    title: "Points",
  },
  {
    key: "lifetime_spend",
    title: "Lifetime Spend",
    render: (value) =>
      formatCurrency(Number(value)),
  },
  {
    key: "progress",
    title: "Progress",
    render: (_value, row) => (
      <div className="w-40">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${row.progress}%`,
            }}
          />
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {row.progress}%
        </p>
      </div>
    ),
  },
  {
  key: "customer_id",
  title: "Actions",
  render: (_value, row) => (
    <Link
      to={`/membership/${row.customer_id}`}
    >
      <Button
        size="icon"
        variant="outline"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </Link>
  ),
}
];

interface MembershipTableProps {
  data: Membership[];
}

export function MembershipTable({
  data,
}: MembershipTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      title="Membership"
      description="Manage customer memberships and loyalty tiers."
      emptyTitle="No members found"
      emptyDescription="Customers will appear here after placing their first order."
      getRowKey={(row) => row.customer_id}
    />
  );
}