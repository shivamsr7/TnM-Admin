import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  useDeleteRewardTier,
  useRewardTiers,
} from "../hooks/useRewardTiers";

import RewardTierDialog from "./RewardTierDialog";

export default function RewardTierTable() {
  const { data = [], isLoading } = useRewardTiers();

  const deleteTier = useDeleteRewardTier();

  if (isLoading) {
    return <div>Loading reward tiers...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Tiers</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tier</TableHead>
              <TableHead>Minimum Spend</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-36">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((tier) => (
              <TableRow key={tier.id}>
                <TableCell className="font-medium">
                  {tier.tier_name}
                </TableCell>

                <TableCell>
                  ₹{tier.minimum_spend}
                </TableCell>

                <TableCell>
                  {tier.multiplier}x
                </TableCell>

                <TableCell>
                  {tier.is_active ? (
                    <span className="text-green-600">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Inactive
                    </span>
                  )}
                </TableCell>

                <TableCell className="flex gap-2">
                  <RewardTierDialog
                    initialData={tier}
                    trigger={
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Reward Tier?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() =>
                            deleteTier.mutate(
                              tier.id
                            )
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No reward tiers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}