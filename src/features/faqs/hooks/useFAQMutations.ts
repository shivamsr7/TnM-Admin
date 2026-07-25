import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { faqService } from "../services/faq.service";

import type {
  FAQFormData,
} from "../types/faq.types";


export function useCreateFAQ() {
  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: (
      data: FAQFormData
    ) =>
      faqService.create(data),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });


      toast.success(
        "FAQ created successfully."
      );
    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );
    },

  });
}



export function useUpdateFAQ() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FAQFormData;
    }) =>
      faqService.update(
        id,
        data
      ),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });


      toast.success(
        "FAQ updated successfully."
      );
    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );
    },

  });
}



export function useDeleteFAQ() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: (
      id: string
    ) =>
      faqService.delete(id),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });


      toast.success(
        "FAQ deleted successfully."
      );
    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );
    },

  });
}