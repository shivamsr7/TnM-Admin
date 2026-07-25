import DataTable from "@/components/shared/DataTable";



import { rewardTransactionColumns } from "./reward-transactions.columns";

import type { RewardTransaction } from "../types";

interface RewardTransactionsTableProps {
  transactions: RewardTransaction[];
}

export default function RewardTransactionsTable({
  transactions,
}: RewardTransactionsTableProps) {
  return (
    <DataTable
      title="Recent Reward Transactions"
      description="Latest reward activity"
      columns={rewardTransactionColumns}
      data={transactions}
      getRowKey={(row) => row.id}
      emptyTitle="No reward transactions"
      emptyDescription="Reward activity will appear here."
    />
  );
}