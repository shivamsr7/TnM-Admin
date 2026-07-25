import { Users } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { useMembershipStats } from "../hooks";

export default function MembershipStats() {
  const {
    data,
    isLoading,
  } = useMembershipStats();

  if (isLoading) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Members
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {data?.totalMembers ?? 0}
            </h2>
          </div>

          <Users className="h-6 w-6 text-primary" />
        </CardContent>
      </Card>

      {data?.tiers.map((tier) => (
        <Card key={tier.id}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p
                className="text-sm font-medium"
                style={{
                  color: tier.badge_color,
                }}
              >
                {tier.tier_name}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {tier.members}
              </h2>
            </div>

            <div
              className="h-5 w-5 rounded-full"
              style={{
                background: tier.badge_color,
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}