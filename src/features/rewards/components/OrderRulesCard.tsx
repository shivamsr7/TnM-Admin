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


import {
  Label,
} from "@/components/ui/label";


import {
  useFormContext,
  Controller,
} from "react-hook-form";




export default function OrderRulesCard(){


const {
control,
}=useFormContext();





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




<Controller

name="award_on"

control={control}

render={({field})=>(


<RadioGroup

value={field.value}

onValueChange={field.onChange}

>


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

<PackageCheck

className="
h-4
w-4
text-green-600
"

/>

Order Delivered (Recommended)

</div>

</Label>


</div>




</RadioGroup>


)}


/>



</div>









{/* Exclusions */}



<div className="space-y-4">


<Label className="text-base font-medium">

Exclusions

</Label>







<Controller

name="ignore_cancelled"

control={control}

render={({field})=>(


<div className="flex items-center space-x-3">


<Checkbox

checked={field.value}

onCheckedChange={field.onChange}

id="cancelled"

/>


<Label htmlFor="cancelled">

Ignore Cancelled Orders

</Label>


</div>


)}


/>









<Controller

name="ignore_returned"

control={control}

render={({field})=>(


<div className="flex items-center space-x-3">


<Checkbox

checked={field.value}

onCheckedChange={field.onChange}

id="returned"

/>


<Label htmlFor="returned">

Ignore Returned Orders

</Label>


</div>


)}


/>









<Controller

name="ignore_refunded"

control={control}

render={({field})=>(


<div className="flex items-center space-x-3">


<Checkbox

checked={field.value}

onCheckedChange={field.onChange}

id="refunded"

/>


<Label htmlFor="refunded">

Ignore Refunded Orders

</Label>


</div>


)}


/>



</div>









{/* Reverse Points */}



<Controller

name="reverse_points"

control={control}

render={({field})=>(


<div className="flex items-center space-x-3">


<Checkbox

checked={field.value}

onCheckedChange={field.onChange}

id="reverse"

/>


<Label htmlFor="reverse">

Automatically deduct earned points if an order is refunded or returned

</Label>


</div>


)}


/>






</CardContent>


</Card>


);

}