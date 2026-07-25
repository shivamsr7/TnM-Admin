import {
  Gift,
  PartyPopper,
  UserPlus,
  Cake,
  ShoppingBag,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BonusRulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-amber-500" />
          Bonus Rules
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="grid gap-6 md:grid-cols-2">

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <PartyPopper className="h-4 w-4" />
              Welcome Bonus
            </Label>

            <Input
              type="number"
              defaultValue={50}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Cake className="h-4 w-4" />
              Birthday Bonus
            </Label>

            <Input
              type="number"
              defaultValue={100}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              First Order Bonus
            </Label>

            <Input
              type="number"
              defaultValue={50}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Referral Bonus
            </Label>

            <Input
              type="number"
              defaultValue={200}
            />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}