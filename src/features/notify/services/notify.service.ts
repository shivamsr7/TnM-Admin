import { supabase } from "@/lib/supabase";

import type {
  NotifyRequest,
  NotifyStats,
  NotifyStatus,
} from "../types/notify.types";


class NotifyService {

  /*
   * =========================================================
   * GET ALL NOTIFY REQUESTS
   * =========================================================
   */

  async getAll(): Promise<NotifyRequest[]> {

    /*
     * -------------------------------------------------------
     * 1. Fetch notify requests
     * -------------------------------------------------------
     *
     * IMPORTANT:
     *
     * Your table has:
     *
     * id
     * product_id
     * customer_id
     * name
     * email
     * phone
     * status
     * created_at
     *
     * There is NO requested_at.
     *
     * -------------------------------------------------------
     */

    const {
      data: requests,
      error: requestsError,
    } = await supabase

      .from("notify_requests")

      .select("*")

      .order(
        "created_at",
        {
          ascending: false,
        }
      );


    if (requestsError) {

      console.error(
        "Notify requests fetch error:",
        requestsError
      );

      throw requestsError;

    }


    if (
      !requests ||
      requests.length === 0
    ) {

      return [];

    }


    /*
     * -------------------------------------------------------
     * 2. Collect product IDs
     * -------------------------------------------------------
     */

    const productIds = Array.from(

      new Set(

        requests

          .map(
            (request) =>
              request.product_id
          )

          .filter(
            (
              id
            ): id is string =>
              Boolean(id)
          )

      )

    );


    /*
     * -------------------------------------------------------
     * 3. Collect customer IDs
     * -------------------------------------------------------
     */

    const customerIds = Array.from(

      new Set(

        requests

          .map(
            (request) =>
              request.customer_id
          )

          .filter(
            (
              id
            ): id is string =>
              Boolean(id)
          )

      )

    );


    /*
     * -------------------------------------------------------
     * 4. Fetch products separately
     * -------------------------------------------------------
     */

    let products: Array<{

      id: string;

      name: string;

      slug: string;

      product_images?: Array<{

        id: string;

        image_url: string;

        is_primary: boolean;

        sort_order: number;

      }>;

    }> = [];


    if (
      productIds.length > 0
    ) {

      const {
        data,
        error,
      } = await supabase

        .from("products")

        .select(`
          id,
          name,
          slug,
          product_images(
            id,
            image_url,
            is_primary,
            sort_order
          )
        `)

        .in(
          "id",
          productIds
        );


      if (error) {

        console.error(
          "Notify products fetch error:",
          error
        );

        throw error;

      }


      products =
        data ?? [];

    }


    /*
     * -------------------------------------------------------
     * 5. Fetch customers separately
     * -------------------------------------------------------
     */

    let customers: Array<{

      id: string;

      first_name: string;

      last_name: string | null;

    }> = [];


    if (
      customerIds.length > 0
    ) {

      const {
        data,
        error,
      } = await supabase

        .from("customers")

        .select(`
          id,
          first_name,
          last_name
        `)

        .in(
          "id",
          customerIds
        );


      if (error) {

        console.error(
          "Notify customers fetch error:",
          error
        );

        throw error;

      }


      customers =
        data ?? [];

    }


    /*
     * -------------------------------------------------------
     * 6. Create lookup maps
     * -------------------------------------------------------
     */

    const productMap =
      new Map(

        products.map(
          (product) => [
            product.id,
            product,
          ]
        )

      );


    const customerMap =
      new Map(

        customers.map(
          (customer) => [
            customer.id,
            customer,
          ]
        )

      );


    /*
     * -------------------------------------------------------
     * 7. Combine data
     * -------------------------------------------------------
     */

    const result =
      requests.map(
        (request) => ({

          ...request,

          product:
            productMap.get(
              request.product_id
            ),

          customer:
            request.customer_id
              ? customerMap.get(
                  request.customer_id
                )
              : undefined,

        })
      );


    return result as NotifyRequest[];

  }


  /*
   * =========================================================
   * GET SINGLE REQUEST
   * =========================================================
   */

  async getById(
    id: string
  ): Promise<NotifyRequest> {

    const {
      data: request,
      error: requestError,
    } = await supabase

      .from("notify_requests")

      .select("*")

      .eq(
        "id",
        id
      )

      .single();


    if (requestError) {

      throw requestError;

    }


    /*
     * -------------------------------------------------------
     * Product
     * -------------------------------------------------------
     */

    let product:
      NotifyRequest["product"] =
        undefined;


    if (
      request.product_id
    ) {

      const {
        data,
        error,
      } = await supabase

        .from("products")

        .select(`
          id,
          name,
          slug,
          product_images(
            id,
            image_url,
            is_primary,
            sort_order
          )
        `)

        .eq(
          "id",
          request.product_id
        )

        .maybeSingle();


      if (error) {

        throw error;

      }


      product =
        data ?? undefined;

    }


    /*
     * -------------------------------------------------------
     * Customer
     * -------------------------------------------------------
     */

    let customer:
      NotifyRequest["customer"] =
        undefined;


    if (
      request.customer_id
    ) {

      const {
        data,
        error,
      } = await supabase

        .from("customers")

        .select(`
          id,
          first_name,
          last_name
        `)

        .eq(
          "id",
          request.customer_id
        )

        .maybeSingle();


      if (error) {

        throw error;

      }


      customer =
        data ?? undefined;

    }


    return {

      ...request,

      product,

      customer,

    } as NotifyRequest;

  }


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  async create(
    values: Partial<NotifyRequest>
  ): Promise<NotifyRequest> {

    const {
      data,
      error,
    } = await supabase

      .from("notify_requests")

      .insert(
        values
      )

      .select()

      .single();


    if (error) {

      throw error;

    }


    return data as NotifyRequest;

  }


  /*
   * =========================================================
   * UPDATE STATUS
   * =========================================================
   *
   * Current database supports ONLY:
   *
   * pending
   * notified
   * cancelled
   *
   * There is no notified_at column.
   *
   * =========================================================
   */

  async updateStatus(
    id: string,
    status: NotifyStatus
  ): Promise<void> {

    const {
      error,
    } = await supabase

      .from("notify_requests")

      .update({

        status,

      })

      .eq(
        "id",
        id
      );


    if (error) {

      throw error;

    }

  }


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  async delete(
    id: string
  ): Promise<void> {

    const {
      error,
    } = await supabase

      .from("notify_requests")

      .delete()

      .eq(
        "id",
        id
      );


    if (error) {

      throw error;

    }

  }


  /*
   * =========================================================
   * STATS
   * =========================================================
   */

  async getStats(): Promise<NotifyStats> {

    const requests =
      await this.getAll();


    return {

      totalRequests:
        requests.length,

      pendingRequests:
        requests.filter(
          (request) =>
            request.status ===
            "pending"
        ).length,

      notifiedRequests:
        requests.filter(
          (request) =>
            request.status ===
            "notified"
        ).length,

      cancelledRequests:
        requests.filter(
          (request) =>
            request.status ===
            "cancelled"
        ).length,

    };

  }

}


export const notifyService =
  new NotifyService();