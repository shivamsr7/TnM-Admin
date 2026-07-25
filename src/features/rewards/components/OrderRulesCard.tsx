import {
  Truck,
  PackageCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import {
  Checkbox
} from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";

export default function OrderRulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-500" />
          Order Rules
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* Award Timing */}

        <div className="space-y-4">

          <Label className="text-base font-medium">
            Award Points When
          </Label>

          <RadioGroup defaultValue="delivered">

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="placed"
                id="placed"
              />

              <Label htmlFor="placed">
                Order Placed
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="paid"
                id="paid"
              />

              <Label htmlFor="paid">
                Payment Completed
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="delivered"
                id="delivered"
              />

              <Label htmlFor="delivered">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-green-600" />
                  Order Delivered (Recommended)
                </div>
              </Label>
            </div>

          </RadioGroup>

        </div>

        {/* Exclusions */}

        <div className="space-y-4">

          <Label className="text-base font-medium">
            Exclusions
          </Label>

          <div className="flex items-center space-x-3">

            <Checkbox
              id="cancelled"
              defaultChecked
            />

            <Label htmlFor="cancelled">
              Ignore Cancelled Orders
            </Label>

          </div>

          <div className="flex items-center space-x-3">

            <Checkbox
              id="returned"
              defaultChecked
            />

            <Label htmlFor="returned">
              Ignore Returned Orders
            </Label>

          </div>

          <div className="flex items-center space-x-3">

            <Checkbox
              id="refunded"
              defaultChecked
            />

            <Label htmlFor="refunded">
              Ignore Refunded Orders
            </Label>

          </div>

        </div>

        {/* Reverse Points */}

        <div className="flex items-center space-x-3">

          <Checkbox
            id="reverse"
            defaultChecked
          />

          <Label htmlFor="reverse">
            Automatically deduct earned points if an order is refunded or returned
          </Label>

        </div>

      </CardContent>
    </Card>
  );
}