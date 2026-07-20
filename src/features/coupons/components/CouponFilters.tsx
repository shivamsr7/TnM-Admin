import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CouponFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  discountType: string;
  onDiscountTypeChange: (value: string) => void;

  sortBy: string;
  onSortByChange: (value: string) => void;
}

export default function CouponFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  discountType,
  onDiscountTypeChange,
  sortBy,
  onSortByChange,
}: CouponFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Input
          placeholder="Search coupon..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />

        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Status
            </SelectItem>

            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="inactive">
              Inactive
            </SelectItem>

            <SelectItem value="expired">
              Expired
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={discountType}
          onValueChange={onDiscountTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Discount Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Types
            </SelectItem>

            <SelectItem value="percentage">
              Percentage
            </SelectItem>

            <SelectItem value="fixed">
              Fixed Amount
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={onSortByChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">
              Newest
            </SelectItem>

            <SelectItem value="oldest">
              Oldest
            </SelectItem>

            <SelectItem value="expiry">
              Expiry Date
            </SelectItem>

            <SelectItem value="usage">
              Most Used
            </SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}