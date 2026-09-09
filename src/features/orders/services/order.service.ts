import { supabase } from "@/lib/supabase";

import {
  rewardsService
} from "@/features/rewards/services/rewards.service";

import {
  notificationService
} from "@/features/notifications/services/notification.service";

import type {
  Order,
  OrderStatus,
} from "../types/order.types";





class OrderService {





  async getAll(): Promise<Order[]> {

    const {
      data,
      error
    } = await supabase

      .from("orders")

      .select("*")

      .order(
        "created_at",
        {
          ascending: false,
        }
      );





    if (error)

      throw error;





    return data ?? [];

  }









  async getOrderItems(

    orderId: string

  ) {

    const {
      data,
      error
    } = await supabase

      .from("order_items")

      .select("*")

      .eq(
        "order_id",
        orderId
      );





    if (error)

      throw error;





    return data ?? [];

  }









  async updateOrder(

    id: string,

    updates: Partial<Order>

  ) {

    const {
      error
    } = await supabase

      .from("orders")

      .update({

        ...updates,

        updated_at:
          new Date().toISOString(),

      })

      .eq(
        "id",
        id
      );





    if (error)

      throw error;

  }









  async getById(

    id: string

  ): Promise<Order> {

    const {
      data,
      error
    } = await supabase

      .from("orders")

      .select("*")

      .eq(
        "id",
        id
      )

      .single();





    if (error)

      throw error;





    return data;

  }









  async updateTracking(

    id: string,

    courier_name: string,

    tracking_number: string

  ) {

    const {
      error
    } = await supabase

      .from("orders")

      .update({

        courier_name,

        tracking_number,

        updated_at:
          new Date().toISOString(),

      })

      .eq(
        "id",
        id
      );





    if (error)

      throw error;





    await this.createActivity({

      order_id:
        id,

      event_type:
        "tracking_updated",

      title:
        "Tracking Updated",

      description:
        `${courier_name} • ${tracking_number}`,

      metadata: {

        courier_name,

        tracking_number,

      },

    });





    const order =
      await this.getById(id);





    if (order.customer_id) {

      await this.createNotification({

        customer_id:
          order.customer_id,

        title:
          "Tracking Updated",

        message:
          `Your order #${order.order_number} tracking has been updated.`,

        reference_id:
          order.id,

      });

    }

  }









  async updateStatus(

    id: string,

    status: OrderStatus,

    notes?: string

  ) {

    /*
     * Fetch the current order once.
     *
     * This is reused for cancellation/refund calculations and
     * for safely setting delivered_at only when the order first
     * transitions into the delivered state.
     */
    const existingOrder =
      await this.getById(id);

    let cancellationRefundAmount =
      0;





    let cancellationRefundStatus:
      "not_required"
      | "pending" =
      "not_required";





    if (
      status ===
      "cancelled"
    ) {

      /*
       * For prepaid orders, total_amount is the authoritative
       * customer-facing amount that was paid for the order.
       *
       * IMPORTANT:
       * advance_amount cannot be used here because the actual
       * order data shows that it can contain the combined
       * Wallet + Razorpay amount.
       *
       * Example:
       *   total_amount   = ₹2297
       *   advance_amount = ₹2297
       *   wallet debit   = ₹25
       *
       * The correct refund is therefore ₹2297, not ₹2322.
       *
       * processRefund() later splits this total into:
       *   Wallet   = original wallet debit
       *   Razorpay = total refund - wallet portion
       */
      if (
        existingOrder.payment_method ===
        "prepaid"
      ) {
        cancellationRefundAmount =
          Math.max(
            0,
            Number(
              existingOrder.total_amount ??
              0
            )
          );
      } else {
        /*
         * Preserve the existing COD behaviour.
         */
        cancellationRefundAmount =
          Number(
            existingOrder.advance_amount ??
            0
          );
      }

      if (
        cancellationRefundAmount >
        0
      ) {

        cancellationRefundStatus =
          "pending";

      }

    }





    const updateData:
      Record<
        string,
        unknown
      > = {

      order_status:
        status,

      updated_at:
        new Date().toISOString(),

    };





    /*
     * Record the exact time the order first becomes delivered.
     *
     * We intentionally do not overwrite delivered_at if the
     * order is already delivered, so later edits cannot reset
     * the 24-hour review-email timer.
     */
    if (
      status === "delivered" &&
      existingOrder.order_status !== "delivered"
    ) {

      updateData.delivered_at =
        new Date().toISOString();

    }





    if (
      status ===
      "cancelled"
    ) {

      updateData.refund_status =
        cancellationRefundStatus;

      updateData.refund_amount =
        cancellationRefundAmount;

      updateData.refund_transaction_id =
        null;

      updateData.refund_processed_at =
        null;

      updateData.refund_notes =
        notes ?? null;

    }





    const {
      error: updateError
    } = await supabase

      .from("orders")

      .update(updateData)

      .eq(
        "id",
        id
      );





    if (updateError)

      throw updateError;





    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();





    const {
      error: historyError
    } = await supabase

      .from("order_status_history")

      .insert({

        order_id:
          id,

        status,

        changed_by:
          user?.id ?? null,

        notes:
          notes ?? null,

      });





    if (historyError)

      throw historyError;





    await this.createActivity({

      order_id:
        id,

      event_type:
        "status_changed",

      title:

        status === "confirmed"

          ? "Order Confirmed"

          : status === "packed"

          ? "Order Packed"

          : status === "shipped"

          ? "Order Shipped"

          : status === "delivered"

          ? "Order Delivered"

          : status === "cancelled"

          ? "Order Cancelled"

          : status === "returned"

          ? "Order Returned"

          : status === "refunded"

          ? "Order Refunded"

          : "Order Updated",

      description:

        status ===
        "cancelled"

          ? (

              cancellationRefundAmount >
              0

                ? `Order cancelled. Refund pending for ₹${cancellationRefundAmount.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}.`

                : "Order cancelled. No refund is required."

            )

          : `Order marked as ${status}`,

      metadata: {

        status,

        ...(status ===
        "cancelled"

          ? {

              cancellation_reason:
                notes ?? null,

              refund_status:
                cancellationRefundStatus,

              refund_amount:
                cancellationRefundAmount,

            }

          : {}),

      },

    });





    const order =
      await this.getById(id);





    // In-app notification

    await this.createStatusNotification(

      order,

      status

    );





    // Status emails

    // Packed / Shipped / Delivered

    await this.sendStatusEmail(

      order,

      status

    );





    // Cancellation email

    if (
      status ===
      "cancelled"
    ) {

      await this.sendCancellationEmail(

        order,

        notes

      );

    }





    // Existing reward handling

    await this.handleOrderStatusChange(

      order,

      status

    );

  }









  async processRefund(
    id: string,
    refundNotes?: string
  ) {

    const order =
      await this.getById(id);

    if (
      order.payment_method !==
      "prepaid"
    ) {
      throw new Error(
        "Refund processing is currently available only for prepaid orders."
      );
    }

    if (
      order.order_status !==
      "cancelled"
    ) {
      throw new Error(
        "Only cancelled orders can be refunded."
      );
    }

    if (
      order.refund_status ===
      "processed"
    ) {
      throw new Error(
        "This refund has already been processed."
      );
    }

    if (
      order.refund_status !==
      "pending"
    ) {
      throw new Error(
        "This order does not have a pending refund."
      );
    }

    const refundAmount =
      Number(
        order.refund_amount ?? 0
      );

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0
    ) {
      throw new Error(
        "Refund amount must be greater than ₹0."
      );
    }

    /*
     * =========================================================
     * STEP 1
     * Refund the wallet portion first.
     *
     * IMPORTANT:
     * Do not query wallet_transactions from the browser here.
     * Admin-side RLS can hide the original wallet debit.
     *
     * refund_wallet_for_order() runs as SECURITY DEFINER and
     * determines the authoritative wallet refund amount inside
     * PostgreSQL.
     *
     * It is also idempotent: if the wallet refund already
     * exists, the existing refund transaction is returned.
     * =========================================================
     */
    let walletRefundTransactionId:
      string | null =
        null;

    let walletRefundAmount =
      0;

    const {
      data: walletRefundResult,
      error: walletRefundError,
    } = await supabase.rpc(
      "refund_wallet_for_order",
      {
        p_order_id:
          order.id,
      }
    );

    if (walletRefundError) {
      console.error(
        "❌ Wallet refund failed:",
        walletRefundError
      );

      throw new Error(
        walletRefundError.message ||
        "Failed to process the wallet refund."
      );
    }

    if (
      !walletRefundResult ||
      walletRefundResult.length === 0
    ) {
      throw new Error(
        "Wallet refund service returned no result."
      );
    }

    const walletRefundRow =
      walletRefundResult[0];

    walletRefundAmount =
      Number(
        walletRefundRow
          .wallet_refund_amount_paise ??
        0
      ) / 100;

    walletRefundTransactionId =
      walletRefundRow
        .wallet_transaction_id ??
      null;

    console.log(
      "💰 Wallet refund result:",
      {
        orderId:
          order.id,

        orderNumber:
          order.order_number,

        totalRefund:
          refundAmount,

        walletRefund:
          walletRefundAmount,

        walletTransactionId:
          walletRefundTransactionId,

        alreadyProcessed:
          walletRefundRow
            .already_processed ??
          false,
      }
    );

    /*
     * =========================================================
     * STEP 2
     * Calculate the Razorpay remainder.
     *
     * Example:
     *   Total refund   = ₹2297
     *   Wallet refund  = ₹25
     *   Razorpay       = ₹2272
     * =========================================================
     */
    const razorpayRefundAmount =
      Math.max(
        0,
        refundAmount -
        walletRefundAmount
      );

    console.log(
      "💰 Refund split:",
      {
        orderId:
          order.id,

        orderNumber:
          order.order_number,

        totalRefund:
          refundAmount,

        walletRefund:
          walletRefundAmount,

        razorpayRefund:
          razorpayRefundAmount,

        paymentId:
          order.payment_transaction_id,
      }
    );

    /*
     * =========================================================
     * STEP 3
     * Refund the remaining Razorpay portion.
     *
     * Wallet-only orders skip this completely.
     * =========================================================
     */
    let razorpayRefundId:
      string | null =
        null;

    if (
      razorpayRefundAmount > 0
    ) {

      if (
        !order.payment_transaction_id?.trim()
      ) {
        throw new Error(
          "Razorpay payment ID is missing for the refundable Razorpay portion."
        );
      }

      const idempotencyKey =
        `tnm_refund_${order.id}`;

      console.log(
        "💳 Starting Razorpay refund:",
        {
          orderId:
            order.id,

          orderNumber:
            order.order_number,

          razorpayPaymentId:
            order.payment_transaction_id,

          razorpayRefundAmount,

          idempotencyKey,
        }
      );

      let refundResponse: {
        success?: boolean;

        refund?: {
          id?: string;

          amount?: number;

          payment_id?: string;

          status?: string;
        };

        error?: string;
      };

      try {

        const {
          data,
          error
        } =
          await supabase.functions.invoke(
            "refund-razorpay-payment",
            {
              body: {
                paymentId:
                  order.payment_transaction_id,

                amount:
                  razorpayRefundAmount,

                idempotencyKey,
              },
            }
          );

        if (error) {
          throw new Error(
            error.message ||
            "Failed to call Razorpay refund service."
          );
        }

        refundResponse =
          data;

      } catch (error) {

        console.error(
          "❌ Razorpay refund request failed:",
          error
        );

        /*
         * The wallet portion may already have been refunded.
         * Do not reverse it here. A retry is safe because the
         * wallet RPC is idempotent.
         */
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to process Razorpay refund."
        );
      }

      if (
        !refundResponse?.success ||
        !refundResponse.refund?.id
      ) {
        throw new Error(
          refundResponse?.error ||
          "Razorpay did not return a valid refund ID."
        );
      }

      razorpayRefundId =
        refundResponse.refund.id;

      console.log(
        "✅ Razorpay refund successful:",
        {
          refundId:
            razorpayRefundId,

          status:
            refundResponse.refund.status,

          amount:
            refundResponse.refund.amount,
        }
      );
    }

    /*
     * =========================================================
     * STEP 4
     * Store both refund results.
     * =========================================================
     */
    const processedAt =
      new Date().toISOString();

    const {
      error: updateError
    } =
      await supabase
        .from("orders")
        .update({
          refund_status:
            "processed",

          /*
           * Keep the existing field backward compatible:
           * Razorpay refund ID when one exists, otherwise the
           * wallet refund transaction ID.
           */
          refund_transaction_id:
            razorpayRefundId ??
            walletRefundTransactionId,

          refund_processed_at:
            processedAt,

          refund_notes:
            refundNotes?.trim() ||
            null,

          wallet_refund_amount:
            walletRefundAmount,

          wallet_refund_transaction_id:
            walletRefundTransactionId,

          razorpay_refund_amount:
            razorpayRefundAmount,

          razorpay_refund_transaction_id:
            razorpayRefundId,

          advance_payment_status:
            "refunded",

          updated_at:
            processedAt,
        })
        .eq(
          "id",
          id
        );

    if (updateError) {
      console.error(
        "❌ Refund succeeded but order update failed:",
        updateError
      );

      throw new Error(
        "Refund was successfully issued, but the order could not be updated. Do not manually refund again."
      );
    }

    /*
     * =========================================================
     * STEP 5
     * Activity log
     * =========================================================
     */
    await this.createActivity({
      order_id:
        id,

      event_type:
        "refund_processed",

      title:
        "Refund Processed",

      description:
        `Refund of ₹${refundAmount.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )} processed.`,

      metadata: {
        refund_status:
          "processed",

        refund_amount:
          refundAmount,

        wallet_refund_amount:
          walletRefundAmount,

        wallet_refund_transaction_id:
          walletRefundTransactionId,

        razorpay_refund_amount:
          razorpayRefundAmount,

        razorpay_refund_transaction_id:
          razorpayRefundId,

        refund_processed_at:
          processedAt,

        razorpay_payment_id:
          order.payment_transaction_id ??
          null,
      },
    });

    /*
     * =========================================================
     * STEP 6
     * Refund email
     * =========================================================
     */
    await this.sendRefundProcessedEmail(
      {
        ...order,
        refund_status:
          "processed",

        refund_transaction_id:
          razorpayRefundId ??
          walletRefundTransactionId,

        refund_processed_at:
          processedAt,

        refund_notes:
          refundNotes?.trim() ||
          null,

        refund_amount:
          refundAmount,

        advance_payment_status:
          "refunded",
      },
      razorpayRefundId ??
        walletRefundTransactionId ??
        "",
      processedAt
    );
  }



  private async sendRefundProcessedEmail(
    order: Order,
    refundTransactionId: string,
    refundProcessedAt: string
  ) {
    if (!order.customer_email) {
      console.error("❌ Refund email skipped: customer_email is missing");
      return;
    }

    const walletPaymentAmount =
      await this.getWalletPaymentAmount(order.id);

    const items = await this.getOrderItems(order.id);

    console.log("📧 Sending refund processed email:", {
      to: order.customer_email,
      orderNumber: order.order_number,
      refundAmount: order.refund_amount,
      refundTransactionId,
    });

    try {
      const result = await notificationService.sendRefundProcessedEmail({
        to: order.customer_email,
        customerName: order.customer_name,
        orderNumber: order.order_number,
        orderDate: order.created_at,
        items: items.map(item => ({
          productName: item.product_name,
          productImage: item.product_image ?? null,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        })),
        subtotal: order.subtotal,
        discount: order.discount,
        shippingCharge: order.shipping_charge,
        tax: order.tax,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        advanceAmount: order.advance_amount,
        paymentTransactionId: order.payment_transaction_id,
        refundAmount: Number(order.refund_amount ?? 0),
        walletAmount: walletPaymentAmount,
        refundTransactionId,
        refundProcessedAt,
        shipping: {
          fullName: order.shipping_full_name ?? order.customer_name,
          phone: order.shipping_phone ?? order.customer_phone,
          address: order.shipping_address ?? "",
          city: order.shipping_city ?? "",
          state: order.shipping_state ?? "",
          pincode: order.shipping_pincode ?? "",
          landmark: order.shipping_landmark ?? null,
          country: order.shipping_country ?? "India",
        },
      });

      console.log("✅ Refund processed email request completed:", result);
    } catch (error) {
      console.error("❌ Refund processed email failed:", error);
    }
  }





  async getOrderHistory(

    orderId: string

  ) {

    const {
      data,
      error
    } = await supabase

      .from("order_status_history")

      .select("*")

      .eq(
        "order_id",
        orderId
      )

      .order(

        "changed_at",

        {
          ascending: true,
        }

      );





    if (error)

      throw error;





    return data ?? [];

  }









  async createNotification({

    customer_id,

    title,

    message,

    reference_id,

  }: {

    customer_id: string;

    title: string;

    message: string;

    reference_id?: string;

  }) {

    const {
      error
    } = await supabase

      .from("notifications")

      .insert({

        customer_id,

        title,

        message,

        type:
          "order",

        reference_id:
          reference_id ?? null,

      });





    if (error)

      throw error;

  }









  private async createStatusNotification(

    order: Order,

    status: OrderStatus

  ) {

    if (!order.customer_id)

      return;





    const notificationMap:

      Partial<

        Record<

          OrderStatus,

          {

            title: string;

            message: string;

          }

        >

      > = {

        confirmed: {

          title:
            "Order Confirmed",

          message:
            `Your order #${order.order_number} has been confirmed.`,

        },

        packed: {

          title:
            "Order Packed",

          message:
            `Your order #${order.order_number} has been packed.`,

        },

        shipped: {

          title:
            "Order Shipped",

          message:
            `Your order #${order.order_number} has been shipped.`,

        },

        delivered: {

          title:
            "Order Delivered",

          message:
            `Your order #${order.order_number} has been delivered.`,

        },

        cancelled: {

          title:
            "Order Cancelled",

          message:

            order.refund_status ===
            "pending"

              ? `Your order #${order.order_number} has been cancelled. Your refund of ₹${Number(
                  order.refund_amount ??
                  0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )} is pending.`

              : `Your order #${order.order_number} has been cancelled. No refund is required.`,

        },

      };





    const notification =
      notificationMap[status];





    if (!notification)

      return;





    await this.createNotification({

      customer_id:
        order.customer_id,

      title:
        notification.title,

      message:
        notification.message,

      reference_id:
        order.id,

    });

  }









  private async getWalletPaymentAmount(orderId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc(
        "get_order_wallet_payment",
        { p_order_id: orderId }
      );

      if (error) {
        console.error(
          "⚠️ Failed to fetch wallet payment amount:",
          error
        );
        return 0;
      }

      const row = Array.isArray(data) ? data[0] : data;

      return Math.max(
        0,
        Number(row?.wallet_amount ?? 0)
      );
    } catch (error) {
      console.error(
        "⚠️ Wallet payment lookup failed:",
        error
      );
      return 0;
    }
  }


  private async prepareReviewLinks(order: Order) {
    if (!order.customer_id || !order.customer_email) {
      return {
        reviewLinks: [],
        requestIds: [],
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "product-review-request",
        {
          body: {
            mode: "prepare",
            orderId: order.id,
          },
        }
      );

      if (error) {
        console.error(
          "❌ Review link preparation failed:",
          error
        );

        return {
          reviewLinks: [],
          requestIds: [],
        };
      }

      const products = Array.isArray(data?.products)
        ? data.products
        : [];

      const requestIds = Array.isArray(data?.requestIds)
        ? data.requestIds.filter(
            (requestId: unknown): requestId is string =>
              typeof requestId === "string" &&
              requestId.length > 0
          )
        : [];

      const reviewLinks = products
        .filter(
          (product: any) =>
            typeof product?.reviewUrl === "string" &&
            product.reviewUrl.length > 0
        )
        .map((product: any) => ({
          productId: product.productId,
          productName: product.productName,
          // product-review-request returns the image as `imageUrl`.
          // notificationService expects `productImage`.
          productImage: product.imageUrl ?? null,
          reviewUrl: product.reviewUrl,
        }));

      return {
        reviewLinks,
        requestIds,
      };
    } catch (error) {
      console.error(
        "❌ Review link preparation request failed:",
        error
      );

      return {
        reviewLinks: [],
        requestIds: [],
      };
    }
  }


  private async sendStatusEmail(

    order: Order,

    status: OrderStatus

  ) {

    console.log(

      "📧 sendStatusEmail called:",

      {

        orderId:
          order.id,

        status,

        customerEmail:
          order.customer_email,

      }

    );





    if (

      status !== "packed" &&

      status !== "shipped" &&

      status !== "delivered"

    ) {

      return;

    }





    if (!order.customer_email) {

      console.error(

        "❌ Email skipped: customer_email is missing"

      );

      return;

    }





    const items =
      await this.getOrderItems(

        order.id

      );

    const walletPaymentAmount =
      await this.getWalletPaymentAmount(order.id);






    

    const reviewPreparation =
      status === "delivered"
        ? await this.prepareReviewLinks(order)
        : {
            reviewLinks: [],
            requestIds: [],
          };

    const reviewLinks =
      reviewPreparation.reviewLinks;

    const reviewRequestIds =
      reviewPreparation.requestIds;

    console.log(
      "📧 Sending status email:",

      {

        status,

        to:
          order.customer_email,

        orderNumber:
          order.order_number,

        itemCount:
          items.length,

      }

    );





    try {

      const result =

        await notificationService

          .sendOrderStatusEmail({

            to:
              order.customer_email,

            customerName:
              order.customer_name,

            orderNumber:
              order.order_number,

            orderDate:
              order.created_at,

            status,





            items:

              items.map(

                item => ({

                  productName:
                    item.product_name,

                  productImage:
                    item.product_image ??
                    null,

                  price:
                    item.price,

                  quantity:
                    item.quantity,

                  total:
                    item.total,

                })

              ),





            subtotal:
              order.subtotal,

            discount:
              order.discount,

            shippingCharge:
              order.shipping_charge,

            tax:
              order.tax,

            totalAmount:
              order.total_amount,





            paymentMethod:
              order.payment_method,

            advanceAmount:
              order.advance_amount,

            remainingAmount:
              order.remaining_amount,

            walletAmount:
              walletPaymentAmount,





            shipping: {

              fullName:
                order.shipping_full_name ??
                order.customer_name,

              phone:
                order.shipping_phone ??
                order.customer_phone,

              address:
                order.shipping_address ??
                "",

              city:
                order.shipping_city ??
                "",

              state:
                order.shipping_state ??
                "",

              pincode:
                order.shipping_pincode ??
                "",

              landmark:
                order.shipping_landmark ??
                null,

              country:
                order.shipping_country ??
                "India",

            },





            courierName:
              order.courier_name,

            trackingNumber:
              order.tracking_number,


            reviewLinks,
          });





      console.log(

        "✅ Status email request completed:",

        result

      );

      /*
       * The review-request function creates secure review links
       * during prepare, but the request is only considered
       * initially sent after the actual Delivered email succeeds.
       *
       * This is important because the 24-hour reminder scheduler
       * only considers requests with initial_sent_at populated.
       */
      if (
        status === "delivered" &&
        reviewRequestIds.length > 0
      ) {
        try {
          const {
            data: markData,
            error: markError,
          } = await supabase.functions.invoke(
            "product-review-request",
            {
              body: {
                mode: "mark_initial_sent",
                orderId: order.id,
                customerEmail: order.customer_email,
                requestIds: reviewRequestIds,
              },
            }
          );

          if (markError) {
            console.error(
              "⚠️ Failed to mark initial review requests as sent:",
              markError
            );
          } else {
            console.log(
              "✅ Initial review requests marked as sent:",
              markData
            );
          }
        } catch (error) {
          console.error(
            "⚠️ Initial review request marking failed:",
            error
          );
        }
      }

    } catch (error) {

      console.error(

        "❌ Status email failed:",

        error

      );

    }

  }









  private async sendCancellationEmail(

    order: Order,

    cancellationReason?: string

  ) {

    if (!order.customer_email) {

      console.error(

        "❌ Cancellation email skipped: customer_email is missing"

      );

      return;

    }





    const items =
      await this.getOrderItems(

        order.id

      );

    const walletPaymentAmount =
      await this.getWalletPaymentAmount(order.id);






    console.log(

      "📧 Sending cancellation email:",

      {

        to:
          order.customer_email,

        orderNumber:
          order.order_number,

        refundStatus:
          order.refund_status,

        refundAmount:
          order.refund_amount,

      }

    );





    try {

      const result =

        await notificationService

          .sendOrderCancellationEmail({

            to:
              order.customer_email,

            customerName:
              order.customer_name,

            orderNumber:
              order.order_number,

            orderDate:
              order.created_at,

            cancellationReason:
              cancellationReason ??
              order.refund_notes ??
              null,





            items:

              items.map(

                item => ({

                  productName:
                    item.product_name,

                  productImage:
                    item.product_image ??
                    null,

                  price:
                    item.price,

                  quantity:
                    item.quantity,

                  total:
                    item.total,

                })

              ),





            subtotal:
              order.subtotal,

            discount:
              order.discount,

            shippingCharge:
              order.shipping_charge,

            tax:
              order.tax,

            totalAmount:
              order.total_amount,





            paymentMethod:
              order.payment_method,

            advanceAmount:
              order.advance_amount,

            remainingAmount:
              order.remaining_amount,

            walletAmount:
              walletPaymentAmount,

            paymentTransactionId:
              order.payment_transaction_id,





            refundStatus:
              order.refund_status,

            refundAmount:
              Number(
                order.refund_amount ??
                0
              ),

            refundTransactionId:
              order.refund_transaction_id,

            refundProcessedAt:
              order.refund_processed_at,





            shipping: {

              fullName:
                order.shipping_full_name ??
                order.customer_name,

              phone:
                order.shipping_phone ??
                order.customer_phone,

              address:
                order.shipping_address ??
                "",

              city:
                order.shipping_city ??
                "",

              state:
                order.shipping_state ??
                "",

              pincode:
                order.shipping_pincode ??
                "",

              landmark:
                order.shipping_landmark ??
                null,

              country:
                order.shipping_country ??
                "India",

            },

          });





      console.log(

        "✅ Cancellation email request completed:",

        result

      );





    } catch (error) {

      console.error(

        "❌ Cancellation email failed:",

        error

      );

    }

  }









  async createActivity({

    order_id,

    event_type,

    title,

    description,

    metadata,

  }: {

    order_id: string;

    event_type: string;

    title: string;

    description?: string;

    metadata?: Record<
      string,
      unknown
    >;

  }) {

    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();





    const {
      error
    } = await supabase

      .from("order_activity")

      .insert({

        order_id,

        event_type,

        title,

        description:
          description ?? null,

        metadata:
          metadata ?? {},

        created_by:
          user?.id ?? null,

      });





    if (error)

      throw error;

  }









  async getOrderActivity(

    orderId: string

  ) {

    const {
      data,
      error
    } = await supabase

      .from("order_activity")

      .select("*")

      .eq(
        "order_id",
        orderId
      )

      .order(

        "created_at",

        {
          ascending: true,
        }

      );





    if (error)

      throw error;





    return data ?? [];

  }









  async delete(

    id: string

  ) {

    const {
      error
    } = await supabase

      .from("orders")

      .delete()

      .eq(
        "id",
        id
      );





    if (error)

      throw error;

  }









  private async handleOrderStatusChange(

    order: Order,

    status: OrderStatus

  ) {

    switch (status) {

      case "delivered":

        await rewardsService.processOrderReward(

          order.id

        );

        break;





      case "returned":

        await rewardsService.reverseOrderReward(

          order.id,

          "returned"

        );

        break;





      case "refunded":

        await rewardsService.reverseOrderReward(

          order.id,

          "refunded"

        );

        break;





      default:

        break;

    }

  }

}





export const orderService =

  new OrderService();