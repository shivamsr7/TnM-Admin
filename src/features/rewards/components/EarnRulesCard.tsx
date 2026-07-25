import { Coins } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function EarnRulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          Earn Rules
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Enable Rewards */}

        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Rewards</Label>

            <p className="text-sm text-muted-foreground">
              Customers earn reward points on eligible orders.
            </p>
          </div>

          <Switch defaultChecked />
        </div>

        {/* Spend */}

        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <Label>Points Per ₹ Spent</Label>

            <Input
              type="number"
              defaultValue={100}
            />
          </div>

          <div>
            <Label>Reward Points</Label>

            <Input
              type="number"
              defaultValue={1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}