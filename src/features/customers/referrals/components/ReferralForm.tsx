import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  RefreshCw,
} from "lucide-react";


import {
  Input,
} from "@/components/ui/input";

import {
  Button,
} from "@/components/ui/button";

import {
  Label,
} from "@/components/ui/label";


import {
  referralSchema,
} from "../schemas/referral.schema";


import type {
  CustomerReferral,
  ReferralFormData,
} from "../types/referral.types";



interface ReferralFormProps {

  initialData?: CustomerReferral | null;

  loading?: boolean;

  onSubmit: (
    data: ReferralFormData
  ) => void;

}



export default function ReferralForm({
  initialData,
  loading = false,
  onSubmit,
}: ReferralFormProps) {



  const form =
    useForm<ReferralFormData>({
      
      resolver:
        zodResolver(referralSchema),

      defaultValues: {

        referral_code: "",

        referred_by: null,

      },

    });



  const {
    register,
    reset,
    setValue,
    handleSubmit,
  } = form;




  useEffect(() => {

    if (initialData) {

      reset({

        referral_code:
          initialData.referral_code,

        referred_by:
          initialData.referred_by,

      });

    } else {

      reset({

        referral_code:
          generateCode(),

        referred_by:
          null,

      });

    }

  }, [
    initialData,
    reset,
  ]);




  const generateCode = () => {

    return (
      "TNM" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );

  };




  const handleGenerate = () => {

    setValue(
      "referral_code",
      generateCode()
    );

  };




  return (

    <form

      onSubmit={
        handleSubmit(onSubmit)
      }

      className="space-y-5"

    >


      <div className="space-y-2">

        <Label>
          Referral Code
        </Label>


        <div className="flex gap-2">

          <Input

            {...register(
              "referral_code"
            )}

            placeholder="TNMXXXX"

          />


          <Button

            type="button"

            variant="outline"

            size="icon"

            onClick={handleGenerate}

          >

            <RefreshCw className="h-4 w-4" />

          </Button>


        </div>

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
              ? "Update Referral"
              : "Create Referral"
        }

      </Button>


    </form>

  );

}