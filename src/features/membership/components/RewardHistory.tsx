import {
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRewardHistory } from "../hooks/useMembership";

interface RewardHistoryProps {
  customerId: string;
}

export default function RewardHistory({
  customerId,
}: RewardHistoryProps) {
  const {
    data = [],
    isLoading,
  } = useRewardHistory(customerId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          Loading reward history...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Reward History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reward transactions found.
          </p>
        ) : (
          <div className="space-y-4">
            {data.map((item: any) => {
              const earned =
                item.points >= 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    {earned ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-red-600" />
                    )}

                    <div>
                      <p className="font-medium">
                        {item.description ||
                          item.transaction_type}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-semibold ${
                      earned
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {earned ? "+" : ""}
                    {item.points}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}