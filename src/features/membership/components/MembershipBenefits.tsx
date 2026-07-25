import { CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MembershipBenefitsProps {
  benefits: string | null;
}

export default function MembershipBenefits({
  benefits,
}: MembershipBenefitsProps) {
  const benefitList =
    benefits
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Membership Benefits
        </CardTitle>
      </CardHeader>

      <CardContent>
        {benefitList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No benefits configured.
          </p>
        ) : (
          <div className="space-y-3">
            {benefitList.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />

                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}