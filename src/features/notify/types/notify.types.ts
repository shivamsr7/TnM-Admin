export type NotifyStatus =
  | "pending"
  | "notified"
  | "cancelled";


export interface NotifyRequest {

  id: string;

  product_id: string;

  customer_id: string | null;

  name: string;

  email: string | null;

  phone: string | null;

  status: NotifyStatus;

  created_at: string;


  product?: {

    id: string;

    name: string;

    slug: string;

    product_images?: {

      id: string;

      image_url: string;

      is_primary: boolean;

      sort_order: number;

    }[];

  };


  customer?: {

    id: string;

    first_name: string;

    last_name: string | null;

  };

}


export interface NotifyStats {

  totalRequests: number;

  pendingRequests: number;

  notifiedRequests: number;

  cancelledRequests: number;

}