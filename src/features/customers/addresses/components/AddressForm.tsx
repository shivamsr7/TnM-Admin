import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";


import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Button,
} from "@/components/ui/button";

import {
  Switch,
} from "@/components/ui/switch";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import {
  addressSchema,
} from "../schemas/address.schema";

import type {
  z,
} from "zod";


import type {
  CustomerAddress,
  AddressFormData,
} from "../types/address.types";



interface AddressFormProps {

  initialData?: CustomerAddress | null;

  loading?: boolean;

  onSubmit: (
    data: AddressFormData
  ) => void;

}



export default function AddressForm({
  initialData,
  loading = false,
  onSubmit,
}: AddressFormProps) {


 const form = useForm<z.input<typeof addressSchema>, any, z.output<typeof addressSchema>>({

    resolver:
      zodResolver(addressSchema),


    defaultValues: {

      type: "home",

      full_name: "",

      phone: "",

      address_line_1: "",

      address_line_2: "",

      city: "",

      state: "",

      postal_code: "",

      country: "India",

      is_default: false,

    },

  });



  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
  } = form;




  useEffect(() => {

    if (!initialData) {

      reset({

        type: "home",

        full_name: "",

        phone: "",

        address_line_1: "",

        address_line_2: "",

        city: "",

        state: "",

        postal_code: "",

        country: "India",

        is_default: false,

      });

      return;

    }



    reset({

      type:
        initialData.type,

      full_name:
        initialData.full_name,

      phone:
        initialData.phone,

      address_line_1:
        initialData.address_line_1,

      address_line_2:
        initialData.address_line_2 ?? "",

      city:
        initialData.city,

      state:
        initialData.state,

      postal_code:
        initialData.postal_code,

      country:
        initialData.country,

      is_default:
        initialData.is_default,

    });


  }, [
    initialData,
    reset,
  ]);




  return (

    <form

      onSubmit={
        handleSubmit((data) =>
          onSubmit(data)
        )
      }

      className="space-y-5"

    >


      {/* Address Type */}

      <div className="space-y-2">

        <Label>
          Address Type
        </Label>


        <Select

          value={
            watch("type")
          }

          onValueChange={(value) =>
            setValue(
              "type",
              value as z.input<typeof addressSchema>["type"]
            )
          }

        >

          <SelectTrigger>

            <SelectValue />

          </SelectTrigger>


          <SelectContent>

            <SelectItem value="home">
              Home
            </SelectItem>


            <SelectItem value="office">
              Office
            </SelectItem>


            <SelectItem value="other">
              Other
            </SelectItem>

          </SelectContent>


        </Select>

      </div>



      {/* Name */}

      <div className="space-y-2">

        <Label>
          Full Name
        </Label>


        <Input
          {...register("full_name")}
          placeholder="Customer name"
        />

      </div>



      {/* Phone */}

      <div className="space-y-2">

        <Label>
          Phone
        </Label>


        <Input
          {...register("phone")}
          placeholder="9876543210"
        />

      </div>



      {/* Address */}

      <div className="space-y-2">

        <Label>
          Address Line 1
        </Label>


        <Input
          {...register("address_line_1")}
          placeholder="House no, street"
        />

      </div>



      <div className="space-y-2">

        <Label>
          Address Line 2
        </Label>


        <Input
          {...register("address_line_2")}
          placeholder="Area, landmark"
        />

      </div>




      <div className="grid grid-cols-2 gap-4">


        <div className="space-y-2">

          <Label>
            City
          </Label>


          <Input
            {...register("city")}
          />

        </div>



        <div className="space-y-2">

          <Label>
            State
          </Label>


          <Input
            {...register("state")}
          />

        </div>


      </div>




      <div className="grid grid-cols-2 gap-4">


        <div className="space-y-2">

          <Label>
            Postal Code
          </Label>


          <Input
            {...register("postal_code")}
          />

        </div>



        <div className="space-y-2">

          <Label>
            Country
          </Label>


          <Input
            {...register("country")}
          />

        </div>


      </div>




      {/* Default */}

      <div className="flex items-center justify-between rounded-lg border p-4">


        <div>

          <p className="font-medium">
            Default Address
          </p>


          <p className="text-sm text-muted-foreground">
            Use this address for orders.
          </p>

        </div>



        <Switch

          checked={
            watch("is_default")
          }


          onCheckedChange={(checked) =>
            setValue(
              "is_default",
              checked
            )
          }

        />


      </div>




      <Button

        type="submit"

        disabled={loading}

        className="w-full"

      >

        {
          loading
            ? "Saving..."
            : initialData
              ? "Update Address"
              : "Add Address"
        }

      </Button>


    </form>

  );

}