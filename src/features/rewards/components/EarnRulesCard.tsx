import { Coins } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  useFormContext,
} from "react-hook-form";



export default function EarnRulesCard() {


const {
register,
}=useFormContext();




return (

<Card>

<CardHeader>

<CardTitle className="flex items-center gap-2">

<Coins className="h-5 w-5 text-yellow-500" />

Earn Rules

</CardTitle>

</CardHeader>





<CardContent className="space-y-6">



<div className="flex items-center justify-between">

<div>

<Label>
Enable Rewards
</Label>

<p className="text-sm text-muted-foreground">
Customers earn reward points on eligible orders.
</p>

</div>



<Switch

{...register(
"rewards_enabled"
)}

/>


</div>







<div className="grid gap-2 md:grid-cols-2">


<div>

<Label>
Points Per ₹ Spent
</Label>


<Input

type="number"

{...register(
"spend_amount",
{
valueAsNumber:true,
}
)}

/>


</div>





<div>

<Label>
Reward Points
</Label>


<Input

type="number"

{...register(
"earn_points",
{
valueAsNumber:true,
}
)}

/>


</div>


</div>




</CardContent>


</Card>

);

}