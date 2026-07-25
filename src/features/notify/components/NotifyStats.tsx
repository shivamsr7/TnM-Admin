import {
  Bell,
  Clock3,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useNotifyStats } from "../hooks/useNotify";

export default function NotifyStats() {
  const { data, isLoading } = useNotifyStats();

  const stats = [
    {
      title: "Total Requests",
      value: data?.totalRequests ?? 0,
      icon: Bell,
    },
    {
      title: "Pending",
      value: data?.pendingRequests ?? 0,
      icon: Clock3,
    },
    {
      title: "Notified",
      value: data?.notifiedRequests ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Purchased",
      value: data?.purchasedRequests ?? 0,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {isLoading ? "-" : stat.value}
                </h2>
              </div>

              <div className="rounded-full bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}