import { Eye, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCustomerRewards } from "../hooks";

export default function CustomerRewardTable() {
  const { data, isLoading } = useCustomerRewards();

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading customer rewards...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Current Points</TableHead>
            <TableHead>Lifetime Earned</TableHead>
            <TableHead>Redeemed</TableHead>
            <TableHead>Referrals</TableHead>
            <TableHead className="w-[220px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length ? (
            data.map((wallet: any) => (
              <TableRow key={wallet.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {wallet.customer?.first_name}{" "}
                      {wallet.customer?.last_name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {wallet.customer?.email}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{
                      backgroundColor:
                        wallet.tier?.badge_color ??
                        "#9CA3AF",
                    }}
                  >
                    {wallet.tier?.tier_name ?? "-"}
                  </span>
                </TableCell>

                <TableCell>
                  {wallet.current_points}
                </TableCell>

                <TableCell>
                  {wallet.lifetime_earned}
                </TableCell>

                <TableCell>
                  {wallet.lifetime_redeemed}
                </TableCell>

                <TableCell>
                  {wallet.referral_count}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                    >
                      <Link
                        to={`/rewards/customers/${wallet.customer_id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center"
              >
                No reward members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}