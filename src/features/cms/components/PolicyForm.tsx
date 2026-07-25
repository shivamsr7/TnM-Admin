import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";


import RichTextEditor from "@/shared/components/editor/RichTextEditor";


import {
  policySchema,
  type PolicySchema,
} from "../schemas/policy.schema";


import type {
  Policy,
  PolicyFormData,
} from "../types/policy.types";



interface PolicyFormProps {

  initialData?: Policy | null;

  loading?: boolean;

  onSubmit: (
    data: PolicyFormData
  ) => void;

}



export default function PolicyForm({
  initialData,
  loading = false,
  onSubmit,
}: PolicyFormProps) {


  const form = useForm<PolicySchema>({

    resolver:
      zodResolver(policySchema),


    defaultValues: {

      title: "",

      slug: "",

      content: "",

      is_active: true,

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

        title: "",

        slug: "",

        content: "",

        is_active: true,

      });

      return;
    }


    reset({

      title:
        initialData.title,

      slug:
        initialData.slug,

      content:
        initialData.content,

      is_active:
        initialData.is_active,

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
      className="space-y-6"
    >


      {/* Title */}

      <div className="space-y-2">

        <Label>
          Title
        </Label>


        <Input

          {...register("title")}

          placeholder="Shipping Policy"

        />

      </div>



      {/* Slug */}

      <div className="space-y-2">

        <Label>
          Slug
        </Label>


        <Input

          {...register("slug")}

          placeholder="shipping-policy"

        />

      </div>




      {/* Content */}

      <div className="space-y-2">

        <Label>
          Content
        </Label>


        <RichTextEditor

          value={
            watch("content")
          }

          onChange={(value) =>
            setValue(
              "content",
              value,
              {
                shouldValidate: true,
              }
            )
          }

        />

      </div>




      {/* Status */}

      <div className="flex items-center justify-between rounded-lg border p-4">


        <div>

          <p className="font-medium">
            Active
          </p>


          <p className="text-sm text-muted-foreground">
            Display this policy on website.
          </p>

        </div>


        <Switch

          checked={
            watch("is_active")
          }


          onCheckedChange={(checked) =>
            setValue(
              "is_active",
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
              ? "Update Policy"
              : "Create Policy"
        }

      </Button>


    </form>

  );
}