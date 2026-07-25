import { supabase } from "@/lib/supabase";
import type { Customer, CustomerFormData } from "../types/customer.types";
import {referralService} from "@/features/customers/referrals/services/referral.service"
class CustomerService {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
.is("deleted_at", null)
.order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  }

  async getById(id: string): Promise<Customer> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
.is("deleted_at", null)
.single();

    if (error) throw error;

    return data;
  }

async create(values: CustomerFormData): Promise<Customer> {

  const { data, error } = await supabase
    .from("customers")
    .insert({
      first_name: values.first_name,
      last_name: values.last_name || null,
      email: values.email || null,
      phone: values.phone || null,
      avatar: values.avatar || null,
      status: values.status,
      notes: values.notes || null,
    })
    .select()
    .single();


  if (error) throw error;



  // Auto create referral profile

  await referralService.createCustomerReferral(
    data.id,
    data.first_name
  );



  return data;
}

  async update(
    id: string,
    values: CustomerFormData
  ): Promise<Customer> {
    const { data, error } = await supabase
      .from("customers")
      .update({
        first_name: values.first_name,
        last_name: values.last_name || null,
        email: values.email || null,
        phone: values.phone || null,
        avatar: values.avatar || null,
        status: values.status,
        notes: values.notes || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id: string): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
async restore(id: string): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .update({
      deleted_at: null,
    })
    .eq("id", id);

  if (error) throw error;
}


}

export const customerService = new CustomerService();