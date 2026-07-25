import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useCustomerOrders(customerId: string) {
  return useQuery({
    queryKey: ["customer-orders", customerId],

    enabled: !!customerId,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          created_at,
          total_amount,
          advance_payment_status,
          order_status
        `)
        .eq("customer_id", customerId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      return data;
    },
  });
}