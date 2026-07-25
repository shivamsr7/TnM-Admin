import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import RewardWalletCard from "../components/RewardWalletCard";
import RewardTransactionsTable from "../components/RewardTransactionsTable";
import { useCustomerReward, useRewardTransactions } from "../hooks";
import RewardPointsDialog from "@/features/rewards/components/RewardPointsDialog"
export default function CustomerRewardDetailsPage() {
  const { customerId } = useParams();

  const {
    data: wallet,
    isLoading: walletLoading,
  } = useCustomerReward(customerId);

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
  } = useRewardTransactions(customerId);

  if (walletLoading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading customer reward wallet...
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Customer reward wallet not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}

      <Button
        asChild
        variant="outline"
      >
        <Link to="/rewards/customers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customer Rewards
        </Link>
      </Button>

      {/* Wallet */}

      <RewardWalletCard wallet={wallet} />

      {/* Actions */}

      <div className="flex gap-3">
       <RewardPointsDialog
  mode="add"
  customerId={wallet.customer_id}
  trigger={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Points
    </Button>
  }
/>

<RewardPointsDialog
  mode="deduct"
  customerId={wallet.customer_id}
  trigger={
    <Button variant="destructive">
      <Minus className="mr-2 h-4 w-4" />
      Deduct Points
    </Button>
  }
/>
      </div>

      {/* Transactions */}

      {transactionsLoading ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          Loading transactions...
        </div>
      ) : (
        <RewardTransactionsTable
          transactions={transactions}
        />
      )}
    </div>
  );
}