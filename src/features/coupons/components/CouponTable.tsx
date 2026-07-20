import { Calendar, Copy } from "lucide-react";

import DataTable from "@/components/shared/DataTable";
import ActionMenu from "@/shared/components/admin/ActionMenu";
import StatusBadge from "@/components/shared/StatusBadge";

import type { Coupon } from "../types/coupon.types";

interface CouponTableProps {
  data: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

function formatDiscount(coupon: Coupon) {
  return coupon.discount_type === "percentage"
    ? `${coupon.discount_value}%`
    : `₹${coupon.discount_value}`;
}

function formatUsage(coupon: Coupon) {
  if (!coupon.usage_limit) {
    return "Unlimited";
  }

  return `${coupon.used_count} / ${coupon.usage_limit}`;
}

function formatExpiry(date: string | null) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CouponTable({
  data,
  onEdit,
  onDelete,
}: CouponTableProps) {
  return (
    <DataTable<Coupon>
      data={data}
      columns={[
        {
          key: "code",
          title: "Code",
          render: (_value, coupon) => (
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {coupon.code}
              </span>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(coupon.code)
                }
                className="text-slate-500 hover:text-slate-800"
                title="Copy Coupon"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ),
        },

        {
          key: "title",
          title: "Title",
          render: (_value, coupon) => (
            <div>
              <div className="font-medium">
                {coupon.title}
              </div>

              {coupon.description && (
                <div className="text-xs text-slate-500">
                  {coupon.description}
                </div>
              )}
            </div>
          ),
        },

        {
          key: "discount_value",
          title: "Discount",
          render: (_value, coupon) => (
            <span className="font-semibold">
              {formatDiscount(coupon)}
            </span>
          ),
        },

        {
          key: "minimum_order_amount",
          title: "Min Order",
          render: (_value, coupon) =>
            coupon.minimum_order_amount > 0
              ? `₹${coupon.minimum_order_amount}`
              : "-",
        },

        {
          key: "used_count",
          title: "Usage",
          render: (_value, coupon) => (
            <span>{formatUsage(coupon)}</span>
          ),
        },

        {
          key: "expires_at",
          title: "Expiry",
          render: (_value, coupon) => (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              {formatExpiry(coupon.expires_at)}
            </div>
          ),
        },

        {
          key: "is_active",
          title: "Status",
          render: (_value, coupon) => (
            <StatusBadge
              status={
                coupon.is_active
                  ? "active"
                  : "inactive"
              }
            />
          ),
        },

        {
          key: "id",
          title: "Actions",
          render: (_value, coupon) => (
            <ActionMenu
              onEdit={() => onEdit(coupon)}
              onDelete={() => onDelete(coupon)}
              extraActions={[
                {
                  label: "Copy Code",
                  icon: Copy,
                  onClick: () =>
                    navigator.clipboard.writeText(
                      coupon.code
                    ),
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}