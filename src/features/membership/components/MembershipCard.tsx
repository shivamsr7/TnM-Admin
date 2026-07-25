import { Crown, Gift } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { Membership } from "../types";

interface MembershipCardProps {
  member: Membership;
}

export default function MembershipCard({
  member,
}: MembershipCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg">
      <CardContent className="space-y-6 p-8">
        <div className="flex items-start justify-between">
          <div>
            <Badge
              className="mb-3 border-white/20 bg-white/20 text-white hover:bg-white/20"
            >
              <Crown className="mr-1 h-3.5 w-3.5" />
              {member.tier_name} Member
            </Badge>

            <h2 className="text-3xl font-bold">
              {member.customer_name}
            </h2>

            <p className="mt-1 text-white/80">
              Lifetime Spend ₹
              {member.lifetime_spend.toLocaleString()}
            </p>
          </div>

          <div className="rounded-full bg-white/20 p-4">
            <Gift className="h-8 w-8" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Membership Progress</span>

            <span>{member.progress}%</span>
          </div>

          <Progress
            value={member.progress}
            className="h-3 bg-white/30"
          />
        </div>

        {member.next_tier ? (
          <div className="rounded-lg bg-white/15 p-4">
            <p className="text-sm text-white/80">
              Spend another
            </p>

            <p className="mt-1 text-2xl font-bold">
              ₹
              {member.amount_to_next_tier.toLocaleString()}
            </p>

            <p className="mt-1 text-sm">
              to unlock{" "}
              <strong>
                {member.next_tier.tier_name}
              </strong>
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-white/15 p-4">
            <p className="text-lg font-semibold">
              🎉 Highest Membership Tier
            </p>

            <p className="mt-1 text-sm text-white/80">
              This customer has reached the highest
              membership tier.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg bg-white/15 p-4">
          <div>
            <p className="text-sm text-white/80">
              Reward Points
            </p>

            <h3 className="text-2xl font-bold">
              {member.current_points.toLocaleString()}
            </h3>
          </div>

          <Gift className="h-10 w-10 text-white/80" />
        </div>
      </CardContent>
    </Card>
  );
}