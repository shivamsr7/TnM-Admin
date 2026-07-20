import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/shared/PageHeader";
import CouponFilters from "../components/CouponFilters";
import EmptyState from "@/shared/components/admin/EmptyState";

import { useCoupons } from "../hooks/useCoupons";
import CouponTable from "../components/CouponTable";
import CouponStats from "../components/CouponStats";
import CouponDialog from "../components/CouponDialog";
import DeleteCouponDialog from "../components/DeleteCouponDialog";

import type { Coupon } from "../types/coupon.types";

export default function CouponsPage() {
  const { data: coupons = [], isLoading } = useCoupons();

  const [search, setSearch] = useState("");

  const [selectedCoupon, setSelectedCoupon] =
    useState<Coupon | null>(null);

  const [openDialog, setOpenDialog] =
    useState(false);

  const [deleteDialog, setDeleteDialog] =
    useState(false);
const [status, setStatus] = useState("all");

const [discountType, setDiscountType] =
  useState("all");

const [sortBy, setSortBy] =
  useState("newest");
  <CouponFilters
  search={search}
  onSearchChange={setSearch}
  status={status}
  onStatusChange={setStatus}
  discountType={discountType}
  onDiscountTypeChange={setDiscountType}
  sortBy={sortBy}
  onSortByChange={setSortBy}
/>
const filteredCoupons = useMemo(() => {
  let items = [...coupons];

  if (search.trim()) {
    const keyword = search.toLowerCase();

    items = items.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(keyword) ||
        coupon.title.toLowerCase().includes(keyword)
    );
  }

  if (status === "active") {
    items = items.filter((c) => c.is_active);
  }

  if (status === "inactive") {
    items = items.filter((c) => !c.is_active);
  }

  if (status === "expired") {
    items = items.filter(
      (c) =>
        c.expires_at &&
        new Date(c.expires_at) < new Date()
    );
  }

  if (discountType !== "all") {
    items = items.filter(
      (c) =>
        c.discount_type === discountType
    );
  }

  switch (sortBy) {
    case "oldest":
      items.sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );
      break;

    case "expiry":
      items.sort(
        (a, b) =>
          new Date(a.expires_at ?? 0).getTime() -
          new Date(b.expires_at ?? 0).getTime()
      );
      break;

    case "usage":
      items.sort(
        (a, b) =>
          b.used_count - a.used_count
      );
      break;

    default:
      items.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  }

  return items;
}, [
  coupons,
  search,
  status,
  discountType,
  sortBy,
]);
  return (
    <div className="space-y-6">

      <PageHeader
        title="Coupons"
        subtitle="Manage promotional coupons for your store."
        action={
          <Button
            onClick={() => {
              setSelectedCoupon(null);
              setOpenDialog(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Coupon
          </Button>
        }
      />

      <CouponStats coupons={coupons} />

      <CouponFilters
  search={search}
  onSearchChange={setSearch}
  status={status}
  onStatusChange={setStatus}
  discountType={discountType}
  onDiscountTypeChange={setDiscountType}
  sortBy={sortBy}
  onSortByChange={setSortBy}
/>

      {filteredCoupons.length === 0 && !isLoading ? (
        <EmptyState
          title="No Coupons"
          description="Create your first coupon."
        />
      ) : (
        <CouponTable
          data={filteredCoupons}
          onEdit={(coupon) => {
            setSelectedCoupon(coupon);
            setOpenDialog(true);
          }}
          onDelete={(coupon) => {
            setSelectedCoupon(coupon);
            setDeleteDialog(true);
          }}
        />
      )}

      <CouponDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        coupon={selectedCoupon}
      />

      <DeleteCouponDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        coupon={selectedCoupon}
      />

    </div>
  );
}