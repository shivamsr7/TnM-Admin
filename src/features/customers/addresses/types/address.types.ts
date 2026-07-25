export interface CustomerAddress {

  id: string;

  customer_id: string;

  type: "home" | "office" | "other";

  full_name: string;

  phone: string;

  address_line_1: string;

  address_line_2?: string | null;

  city: string;

  state: string;

  postal_code: string;

  country: string;

  is_default: boolean;

  created_at: string;

  updated_at: string;
}



export interface AddressFormData {

  type: "home" | "office" | "other";

  full_name: string;

  phone: string;

  address_line_1: string;

  address_line_2?: string | null;

  city: string;

  state: string;

  postal_code: string;

  country?: string;

  is_default?: boolean;

}