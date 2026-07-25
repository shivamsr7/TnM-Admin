import { Badge } from "@/components/ui/badge";
import type { Column } from "@/components/shared/DataTable";
import type { RewardTransaction } from "../types";

export const customerRewardHistoryColumns: Column<RewardTransaction>[] = [
  {
    key: "transaction_type",
    title: "Transaction",
    render: (value) => (
      <Badge variant="secondary" className="capitalize">
        {String(value).replaceAll("_", " ")}
      </Badge>
    ),
  },

  {
    key: "points",
    title: "Points",
    render: (value) => {
      const points = Number(value);

      return (
        <span
          className={
            points >= 0
              ? "font-medium text-green-600"
              : "font-medium text-red-600"
          }
        >
          {points > 0 ? "+" : ""}
          {points}
        </span>
      );
    },
  },

  {
    key: "description",
    title: "Description",
  },

  {
    key: "created_at",
    title: "Date",
    render: (value) =>
      new Date(String(value)).toLocaleDateString(),
  },
];