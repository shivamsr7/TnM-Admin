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

    const {
      error: updateError
    } = await supabase

      .from("orders")

      .update({

        order_status:
          status,

        updated_at:
          new Date().toISOString(),

      })

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

          : "Order Updated",

      description:
        `Order marked as ${status}`,

      metadata: {

        status,

      },

    });





    const order =
      await this.getById(id);





    // Existing in-app notification

    await this.createStatusNotification(

      order,

      status

    );





    // Email notification

    // Only Packed, Shipped and Delivered

    await this.sendStatusEmail(

      order,

      status

    );





    // Existing reward handling

    await this.handleOrderStatusChange(

      order,

      status

    );

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









  private async sendStatusEmail(

    order: Order,

    status: OrderStatus

  ) {

    console.log(
      "📧 sendStatusEmail called:",
      {
        orderId: order.id,
        status,
        customerEmail:
          order.customer_email,
      }
    );





    // Only these statuses send email

    if (

      status !== "packed" &&

      status !== "shipped" &&

      status !== "delivered"

    ) {

      console.log(
        "📧 Email skipped: status is not email-enabled"
      );

      return;

    }





    // Customer email is required

    if (!order.customer_email) {

      console.error(
        "❌ Email skipped: customer_email is missing",
        order.id
      );

      return;

    }





    const items =
      await this.getOrderItems(
        order.id
      );





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

          });





      console.log(
        "✅ Status email request completed:",
        result
      );





    } catch (error) {

      console.error(
        "❌ Status email failed:",
        error
      );





      // Don't roll back the order status

      // because email failure should not

      // undo the admin's status update.

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