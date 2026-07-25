import LoadingSpinner from "@/shared/components/LoadingSpinner";
import DataTable from "@/components/shared/DataTable";

import { useRewardTransactions } from "../hooks";

import { customerRewardHistoryColumns } from "./customer-reward-history.columns";

interface Props {
  customerId: string;
}

export default function CustomerRewardHistory({
  customerId,
}: Props) {
  const {
    data = [],
    isLoading,
  } = useRewardTransactions(customerId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DataTable
      title="Reward History"
      description="All reward transactions for this customer"
      columns={customerRewardHistoryColumns}
      data={data}
      getRowKey={(row) => row.id}
      emptyTitle="No reward history"
      emptyDescription="Reward transactions will appear here."
    />
  );
}