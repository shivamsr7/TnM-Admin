import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { policyService } from "../services/policy.service";

import type {
  PolicyFormData,
} from "../types/policy.types";


export function useCreatePolicy() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: (
      data: PolicyFormData
    ) =>
      policyService.create(data),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["policies"],
      });


      toast.success(
        "Policy created successfully."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });
}




export function useUpdatePolicy() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: PolicyFormData;
    }) =>
      policyService.update(
        id,
        data
      ),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["policies"],
      });


      toast.success(
        "Policy updated successfully."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });
}





export function useDeletePolicy() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: (
      id: string
    ) =>
      policyService.delete(id),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["policies"],
      });


      toast.success(
        "Policy deleted successfully."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });
}