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

import {
  useFormContext,
} from "react-hook-form";



export default function BonusRulesCard() {


const {
register,
}=useFormContext();




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

{...register(
"welcome_bonus",
{
valueAsNumber:true,
}
)}

/>

</div>







<div className="space-y-2">

<Label className="flex items-center gap-2">

<Cake className="h-4 w-4" />

Birthday Bonus

</Label>


<Input

type="number"

{...register(
"birthday_bonus",
{
valueAsNumber:true,
}
)}

/>

</div>







<div className="space-y-2">

<Label className="flex items-center gap-2">

<ShoppingBag className="h-4 w-4" />

First Order Bonus

</Label>


<Input

type="number"

{...register(
"first_order_bonus",
{
valueAsNumber:true,
}
)}

/>

</div>







<div className="space-y-2">

<Label className="flex items-center gap-2">

<UserPlus className="h-4 w-4" />

Referral Bonus

</Label>


<Input

type="number"

{...register(
"referral_bonus",
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