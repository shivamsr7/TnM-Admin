import { supabase } from "@/lib/supabase";

import type {
  CustomerAddress,
  AddressFormData,
} from "../types/address.types";


const TABLE = "customer_addresses";


export const addressService = {


  async getByCustomer(
    customerId: string
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .eq(
          "customer_id",
          customerId
        )
        .order(
          "is_default",
          {
            ascending: false,
          }
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );


    if (error) throw error;


    return data as CustomerAddress[];

  },



  async getById(
    id: string
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .select("*")
        .eq(
          "id",
          id
        )
        .single();


    if (error) throw error;


    return data as CustomerAddress;

  },



  async create(
    customerId: string,
    payload: AddressFormData
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .insert({
          ...payload,
          customer_id: customerId,
        })
        .select()
        .single();


    if (error) throw error;


    return data as CustomerAddress;

  },



  async update(
    id: string,
    payload: AddressFormData
  ) {

    const { data, error } =
      await supabase
        .from(TABLE)
        .update(payload)
        .eq(
          "id",
          id
        )
        .select()
        .single();


    if (error) throw error;


    return data as CustomerAddress;

  },



  async delete(
    id: string
  ) {

    const { error } =
      await supabase
        .from(TABLE)
        .delete()
        .eq(
          "id",
          id
        );


    if (error) throw error;

  },



  async setDefault(
    customerId: string,
    addressId: string
  ) {

    // Remove existing default

    const { error: resetError } =
      await supabase
        .from(TABLE)
        .update({
          is_default: false,
        })
        .eq(
          "customer_id",
          customerId
        );


    if (resetError) {
      throw resetError;
    }



    // Set selected address default

    const { error } =
      await supabase
        .from(TABLE)
        .update({
          is_default: true,
        })
        .eq(
          "id",
          addressId
        );


    if (error) throw error;

  },


};