import { Gift } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function RedeemRulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-pink-500" />
          Redeem Rules
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Enable */}

        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Redemption</Label>

            <p className="text-sm text-muted-foreground">
              Allow customers to redeem reward points.
            </p>
          </div>

          <Switch defaultChecked />
        </div>

        {/* Minimum Points */}

        <div className="space-y-2">
          <Label>Minimum Points Required</Label>

          <Input
            type="number"
            defaultValue={1000}
          />
        </div>

        {/* Max Redeem */}

        <div className="space-y-2">
          <Label>Maximum Redeem (%)</Label>

          <Input
            type="number"
            defaultValue={20}
          />
        </div>

        {/* Point Value */}

        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label>Points</Label>

            <Input
              type="number"
              defaultValue={1000}
            />
          </div>

          <div className="space-y-2">
            <Label>Value (₹)</Label>

            <Input
              type="number"
              defaultValue={10}
            />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}