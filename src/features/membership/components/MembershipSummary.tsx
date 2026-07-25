import { Card, CardContent } from "@/components/ui/card";

import type { Membership } from "../types";

interface MembershipSummaryProps {
  member: Membership;
}

export default function MembershipSummary({
  member,
}: MembershipSummaryProps) {
  const cards = [
    {
      label: "Lifetime Spend",
      value: `₹${member.lifetime_spend.toLocaleString()}`,
    },
    {
      label: "Reward Points",
      value: member.current_points.toLocaleString(),
    },
    {
      label: "Current Tier",
      value: member.tier_name,
    },
    {
      label: "Next Tier",
      value: member.next_tier?.tier_name ?? "-",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              {card.label}
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {card.value}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}