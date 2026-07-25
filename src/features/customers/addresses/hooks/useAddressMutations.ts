import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { addressService } from "../services/address.service";

import type {
  AddressFormData,
} from "../types/address.types";



export function useCreateAddress() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: AddressFormData;
    }) =>
      addressService.create(
        customerId,
        data
      ),


    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({
        queryKey: [
          "customer-addresses",
          variables.customerId,
        ],
      });


      toast.success(
        "Address added successfully."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });

}





export function useUpdateAddress() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AddressFormData;
    }) =>
      addressService.update(
        id,
        data
      ),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "customer-addresses",
        ],
      });


      toast.success(
        "Address updated successfully."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });

}





export function useDeleteAddress() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: (
      id: string
    ) =>
      addressService.delete(
        id
      ),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "customer-addresses",
        ],
      });


      toast.success(
        "Address deleted successfully."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });

}





export function useSetDefaultAddress() {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: ({
      customerId,
      addressId,
    }: {
      customerId: string;
      addressId: string;
    }) =>
      addressService.setDefault(
        customerId,
        addressId
      ),


    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({
        queryKey: [
          "customer-addresses",
          variables.customerId,
        ],
      });


      toast.success(
        "Default address updated."
      );

    },


    onError: (error: Error) => {

      toast.error(
        error.message
      );

    },

  });

}