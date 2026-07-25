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
  Textarea,
} from "@/components/ui/textarea";

import {
  Button,
} from "@/components/ui/button";

import {
  Label,
} from "@/components/ui/label";

import {
  Switch,
} from "@/components/ui/switch";


import {
  faqSchema,
  type FAQSchema,
} from "../schemas/faq.schema";


import type {
  FAQ,
  FAQFormData,
} from "../types/faq.types";


interface FAQFormProps {

  initialData?: FAQ | null;

  loading?: boolean;

  onSubmit: (
    data: FAQFormData
  ) => void;

}



export default function FAQForm({
  initialData,
  loading,
  onSubmit,
}: FAQFormProps) {


  const form = useForm<FAQSchema>({
    resolver: zodResolver(faqSchema),

    defaultValues: {

      question: "",

      answer: "",

      sort_order: 0,

      is_active: true,

    },
  });


  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
  } = form;



  useEffect(() => {

    if (!initialData) {
      reset({
        question: "",
        answer: "",
        sort_order: 0,
        is_active: true,
      });

      return;
    }


    reset({

      question:
        initialData.question,

      answer:
        initialData.answer,

      sort_order:
        initialData.sort_order,

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
      className="space-y-5"
    >


      <div>

        <Label>
          Question
        </Label>

        <Input
          {...register("question")}
          placeholder="Enter question"
        />

      </div>



      <div>

        <Label>
          Answer
        </Label>


        <Textarea
          {...register("answer")}
          placeholder="Enter answer"
          rows={6}
        />

      </div>



      <div>

        <Label>
          Sort Order
        </Label>


        <Input

          type="number"

          {...register(
            "sort_order",
            {
              valueAsNumber: true,
            }
          )}

        />

      </div>



      <div className="flex items-center justify-between rounded-lg border p-4">

        <div>

          <p className="font-medium">
            Active
          </p>


          <p className="text-sm text-muted-foreground">
            Show this FAQ on website.
          </p>

        </div>


        <Switch

          checked={
            watch("is_active")
          }

          onCheckedChange={
            (checked) =>
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
              ? "Update FAQ"
              : "Create FAQ"
        }

      </Button>


    </form>

  );
}