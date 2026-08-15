import { supabase } from "@/lib/supabase";





type OrderStatusEmailStatus =
  | "packed"
  | "shipped"
  | "delivered";





type RefundStatus =
  | "not_required"
  | "pending"
  | "processed"
  | "failed";





interface OrderStatusEmailPayload {

  to: string;

  customerName: string;

  orderNumber: string;

  orderDate: string;

  status: OrderStatusEmailStatus;

  items: {

    productName: string;

    productImage: string | null;

    price: number;

    quantity: number;

    total: number;

  }[];

  subtotal: number;

  discount: number;

  shippingCharge: number;

  tax: number;

  totalAmount: number;

  paymentMethod:
    | "partial_cod"
    | "prepaid";

  advanceAmount: number;

  remainingAmount: number;

  shipping: {

    fullName: string;

    phone: string;

    address: string;

    city: string;

    state: string;

    pincode: string;

    landmark: string | null;

    country: string | null;

  };

  courierName: string | null;

  trackingNumber: string | null;

}





interface OrderCancellationEmailPayload {

  to: string;

  customerName: string;

  orderNumber: string;

  orderDate: string;

  cancellationReason: string | null;

  items: {

    productName: string;

    productImage: string | null;

    price: number;

    quantity: number;

    total: number;

  }[];

  subtotal: number;

  discount: number;

  shippingCharge: number;

  tax: number;

  totalAmount: number;

  paymentMethod:
    | "partial_cod"
    | "prepaid";

  advanceAmount: number;

  remainingAmount: number;

  paymentTransactionId: string | null;

  refundStatus: RefundStatus;

  refundAmount: number;

  refundTransactionId: string | null;

  refundProcessedAt: string | null;

  shipping: {

    fullName: string;

    phone: string;

    address: string;

    city: string;

    state: string;

    pincode: string;

    landmark: string | null;

    country: string | null;

  };

}





interface RefundProcessedEmailPayload {
  to: string; customerName: string; orderNumber: string; orderDate: string;
  items: { productName: string; productImage: string | null; price: number; quantity: number; total: number; }[];
  subtotal: number; discount: number; shippingCharge: number; tax: number; totalAmount: number;
  paymentMethod: "partial_cod" | "prepaid"; advanceAmount: number; paymentTransactionId: string | null;
  refundAmount: number; refundTransactionId: string; refundProcessedAt: string;
  shipping: { fullName: string; phone: string; address: string; city: string; state: string; pincode: string; landmark: string | null; country: string | null; };
}

class NotificationService {





  async createNotification({

    customerId,

    title,

    message,

    referenceId = null,

  }: {

    customerId: string;

    title: string;

    message: string;

    referenceId?: string | null;

  }) {





    const {

      error

    } = await supabase

      .from("notifications")

      .insert({

        customer_id:
          customerId,

        title,

        message,

        type:
          "order",

        reference_id:
          referenceId,

      });





    if (error)

      throw error;

  }








  async sendEmail({

    to,

    subject,

    html,

  }: {

    to: string;

    subject: string;

    html: string;

  }) {





    if (!to) {

      throw new Error(
        "Recipient email is missing"
      );

    }





    console.log(

      "📧 Sending order email:",

      {

        to,

        subject,

      }

    );





    const {

      data,

      error

    } = await supabase.functions.invoke(

      "send-email",

      {

        body: {

          to,

          subject,

          html,

        },

      }

    );





    console.log(

      "📧 send-email response:",

      {

        data,

        error,

      }

    );





    if (error) {

      console.error(

        "❌ send-email Edge Function failed:",

        error

      );

      throw error;

    }





    console.log(

      "✅ Order email sent:",

      data

    );





    return {

      success: true,

      data,

    };

  }







  async sendOrderStatusEmail({

    to,

    customerName,

    orderNumber,

    orderDate,

    status,

    items,

    subtotal,

    discount,

    shippingCharge,

    tax,

    totalAmount,

    paymentMethod,

    advanceAmount,

    remainingAmount,

    shipping,

    courierName,

    trackingNumber,

  }: OrderStatusEmailPayload) {





    const formatMoney = (

      amount: number

    ) =>

      `₹${amount.toLocaleString(

        "en-IN",

        {

          minimumFractionDigits: 2,

          maximumFractionDigits: 2,

        }

      )}`;





    const escapeHtml = (

      value: string

    ) =>

      value

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");





    const formattedDate =

      new Date(

        orderDate

      ).toLocaleDateString(

        "en-IN",

        {

          day:
            "numeric",

          month:
            "long",

          year:
            "numeric",

        }

      );





    const statusContent = {

      packed: {

        subject:
          `T&M Jewels — Your Order Is Packed #${orderNumber}`,

        title:
          "Your Order Is Packed",

        icon:
          "📦",

        message:
          "Good news! Your jewellery has been carefully packed and is ready for dispatch.",

      },

      shipped: {

        subject:
          `T&M Jewels — Your Order Has Shipped #${orderNumber}`,

        title:
          "Your Order Has Shipped",

        icon:
          "🚚",

        message:
          "Your jewellery is on its way! Your order has been handed over to our delivery partner.",

      },

      delivered: {

        subject:
          `T&M Jewels — Your Order Has Been Delivered #${orderNumber}`,

        title:
          "Your Order Has Been Delivered",

        icon:
          "✓",

        message:
          "Your jewellery has been delivered. We hope you love your new piece!",

      },

    }[status];





    const productRows = items

      .map(

        item => `

          <tr>

            <td

              style="

                padding:15px 8px 15px 0;

                border-bottom:1px solid #eeeae2;

              "

            >

              <table

                role="presentation"

                cellspacing="0"

                cellpadding="0"

                border="0"

              >

                <tr>

                  <td

                    style="

                      width:65px;

                      vertical-align:middle;

                    "

                  >

                    ${

                      item.productImage

                        ? `

                          <img

                            src="${item.productImage}"

                            alt="${escapeHtml(

                              item.productName

                            )}"

                            width="65"

                            height="65"

                            style="

                              display:block;

                              width:65px;

                              height:65px;

                              object-fit:cover;

                              border-radius:9px;

                              border:1px solid #eee7da;

                            "

                          />

                        `

                        : `

                          <div

                            style="

                              width:65px;

                              height:65px;

                              background:#f7f3eb;

                              border-radius:9px;

                              border:1px solid #eee7da;

                            "

                          ></div>

                        `

                    }

                  </td>





                  <td

                    style="

                      padding-left:12px;

                      vertical-align:middle;

                    "

                  >

                    <div

                      style="

                        font-size:14px;

                        line-height:20px;

                        font-weight:600;

                        color:#222222;

                      "

                    >

                      ${escapeHtml(

                        item.productName

                      )}

                    </div>





                    <div

                      style="

                        margin-top:4px;

                        font-size:12px;

                        color:#8c877e;

                      "

                    >

                      Qty: ${item.quantity}

                    </div>

                  </td>

                </tr>

              </table>

            </td>





            <td

              align="right"

              style="

                padding:15px 0;

                border-bottom:1px solid #eeeae2;

                font-size:14px;

                font-weight:600;

                color:#222222;

                white-space:nowrap;

              "

            >

              ${formatMoney(

                item.total

              )}

            </td>

          </tr>

        `

      )

      .join("");





    const discountRow =

      discount > 0

        ? `

          <tr>

            <td

              style="

                padding:7px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Discount

            </td>





            <td

              align="right"

              style="

                padding:7px 0;

                font-size:13px;

                color:#4f7b45;

              "

            >

              -${formatMoney(discount)}

            </td>

          </tr>

        `

        : "";





    const taxRow =

      tax > 0

        ? `

          <tr>

            <td

              style="

                padding:7px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Tax

            </td>





            <td

              align="right"

              style="

                padding:7px 0;

                font-size:13px;

              "

            >

              ${formatMoney(tax)}

            </td>

          </tr>

        `

        : "";





    const remainingPaymentRow =

      paymentMethod === "partial_cod"

        ? `

          <tr>

            <td

              style="

                padding:7px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Remaining on Delivery

            </td>





            <td

              align="right"

              style="

                padding:7px 0;

                font-size:13px;

                font-weight:600;

              "

            >

              ${formatMoney(

                remainingAmount

              )}

            </td>

          </tr>

        `

        : "";





    const trackingSection =

      status === "shipped"

        ? `

          <tr>

            <td

              style="

                padding:24px 24px 0;

              "

            >

              <div

                style="

                  padding:18px;

                  background:#faf8f3;

                  border:1px solid #e8dfd0;

                "

              >

                <div

                  style="

                    font-family:Georgia,'Times New Roman',serif;

                    font-size:18px;

                    font-weight:600;

                    color:#49371d;

                  "

                >

                  Shipping Information

                </div>





                <table

                  role="presentation"

                  width="100%"

                  cellspacing="0"

                  cellpadding="0"

                  border="0"

                  style="margin-top:10px;"

                >

                  <tr>

                    <td

                      style="

                        padding:6px 0;

                        font-size:13px;

                        color:#77736c;

                      "

                    >

                      Courier

                    </td>





                    <td

                      align="right"

                      style="

                        padding:6px 0;

                        font-size:13px;

                        font-weight:600;

                      "

                    >

                      ${

                        courierName

                          ? escapeHtml(

                              courierName

                            )

                          : "Shipping Partner"

                      }

                    </td>

                  </tr>





                  <tr>

                    <td

                      style="

                        padding:6px 0;

                        font-size:13px;

                        color:#77736c;

                      "

                    >

                      Tracking Number

                    </td>





                    <td

                      align="right"

                      style="

                        padding:6px 0;

                        font-size:13px;

                        font-weight:600;

                        word-break:break-all;

                      "

                    >

                      ${

                        trackingNumber

                          ? escapeHtml(

                              trackingNumber

                            )

                          : "Will be updated soon"

                      }

                    </td>

                  </tr>

                </table>

              </div>

            </td>

          </tr>

        `

        : "";





    const deliveredMessage =

      status === "delivered"

        ? `

          <tr>

            <td

              style="

                padding:24px 24px 0;

              "

            >

              <div

                style="

                  padding:16px;

                  background:#fbfaf7;

                  border-left:3px solid #c8a44d;

                  font-size:13px;

                  line-height:22px;

                  color:#68635c;

                "

              >

                We hope your jewellery brings you joy. ❤️

                Thank you for being a part of the

                T&amp;M Jewels family.

              </div>

            </td>

          </tr>

        `

        : "";





    return this.sendEmail({

      to,





      subject:
        statusContent.subject,





      html: `

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta

    name="viewport"

    content="width=device-width, initial-scale=1.0"

  >

  <meta

    name="color-scheme"

    content="light"

  >

  <meta

    name="supported-color-schemes"

    content="light"

  >

  <title>

    T&amp;M Jewels

  </title>

</head>





<body

  style="

    margin:0;

    padding:0;

    background:#f5f3ef;

    color:#222222;

    font-family:Arial,Helvetica,sans-serif;

    -webkit-text-size-adjust:100%;

  "

>





<table

  role="presentation"

  width="100%"

  cellspacing="0"

  cellpadding="0"

  border="0"

  style="background:#f5f3ef;"

>

  <tr>

    <td

      align="center"

      style="padding:28px 12px;"

    >

      <table

        role="presentation"

        width="100%"

        cellspacing="0"

        cellpadding="0"

        border="0"

        style="

          width:100%;

          max-width:640px;

          background:#ffffff;

          border:1px solid #e9e3d8;

        "

      >

        <tr>

          <td

            align="center"

            style="

              padding:30px 20px 24px;

              border-bottom:1px solid #eeeae2;

            "

          >

            <img

              src="https://wzphyyoftwxvpqxtfgtb.supabase.co/storage/v1/object/public/Logo/MainLogo.png"

              alt="T&amp;M Jewels"

              width="190"

              style="

                display:block;

                width:190px;

                max-width:80%;

                height:auto;

                margin:0 auto;

              "

            />





            <div

              style="

                margin-top:10px;

                font-size:11px;

                line-height:18px;

                letter-spacing:1.5px;

                color:#999287;

                text-transform:uppercase;

              "

            >

              Create your own style. Create your own trend.

            </div>

          </td>

        </tr>





        <tr>

          <td

            align="center"

            style="padding:36px 24px 22px;"

          >

            <div

              style="

                width:58px;

                height:58px;

                line-height:58px;

                border-radius:50%;

                background:#f3f7ef;

                color:#4d8a4b;

                font-size:25px;

                font-weight:bold;

              "

            >

              ${statusContent.icon}

            </div>





            <h1

              style="

                margin:18px 0 8px;

                font-family:Georgia,'Times New Roman',serif;

                font-size:29px;

                line-height:37px;

                font-weight:600;

                color:#8b6424;

              "

            >

              ${statusContent.title}

            </h1>





            <p

              style="

                margin:0;

                font-size:14px;

                line-height:23px;

                color:#6e6a63;

              "

            >

              Dear ${escapeHtml(

                customerName

              )},<br>

              ${statusContent.message}

            </p>

          </td>

        </tr>





        <tr>

          <td

            style="padding:4px 24px 20px;"

          >

            <table

              role="presentation"

              width="100%"

              cellspacing="0"

              cellpadding="0"

              border="0"

              style="

                background:#faf8f3;

                border:1px solid #e8dfd0;

              "

            >

              <tr>

                <td

                  width="50%"

                  style="

                    padding:17px;

                    border-right:1px solid #e5ddcf;

                  "

                >

                  <div

                    style="

                      font-size:10px;

                      line-height:16px;

                      color:#9c968c;

                      text-transform:uppercase;

                      letter-spacing:1.2px;

                    "

                  >

                    Order Number

                  </div>





                  <div

                    style="

                      margin-top:5px;

                      font-size:16px;

                      line-height:22px;

                      font-weight:600;

                      color:#222222;

                    "

                  >

                    #${escapeHtml(

                      orderNumber

                    )}

                  </div>

                </td>





                <td

                  width="50%"

                  style="padding:17px;"

                >

                  <div

                    style="

                      font-size:10px;

                      line-height:16px;

                      color:#9c968c;

                      text-transform:uppercase;

                      letter-spacing:1.2px;

                    "

                  >

                    Order Date

                  </div>





                  <div

                    style="

                      margin-top:5px;

                      font-size:14px;

                      line-height:22px;

                      font-weight:600;

                      color:#222222;

                    "

                  >

                    ${formattedDate}

                  </div>

                </td>

              </tr>

            </table>

          </td>

        </tr>





        <tr>

          <td

            style="padding:0 24px;"

          >

            <div

              style="

                padding:13px 16px;

                background:#f7f1e5;

                color:#59431f;

                font-family:Georgia,'Times New Roman',serif;

                font-size:20px;

                line-height:28px;

                font-weight:600;

              "

            >

              Order Details

            </div>





            <table

              role="presentation"

              width="100%"

              cellspacing="0"

              cellpadding="0"

              border="0"

            >

              <tr>

                <td

                  style="

                    padding:12px 0;

                    font-size:11px;

                    font-weight:600;

                    color:#999287;

                    text-transform:uppercase;

                    letter-spacing:.7px;

                    border-bottom:1px solid #eeeae2;

                  "

                >

                  Product

                </td>





                <td

                  align="right"

                  style="

                    padding:12px 0;

                    font-size:11px;

                    font-weight:600;

                    color:#999287;

                    text-transform:uppercase;

                    letter-spacing:.7px;

                    border-bottom:1px solid #eeeae2;

                  "

                >

                  Amount

                </td>

              </tr>





              ${productRows}

            </table>

          </td>

        </tr>





        <tr>

          <td

            style="

              padding:22px 24px 0;

            "

          >

            <table

              role="presentation"

              width="100%"

              cellspacing="0"

              cellpadding="0"

              border="0"

              style="

                border-top:1px solid #eeeae2;

                border-bottom:1px solid #eeeae2;

              "

            >

              <tr>

                <td

                  style="

                    padding:7px 0;

                    font-size:13px;

                    color:#77736c;

                  "

                >

                  Subtotal

                </td>





                <td

                  align="right"

                  style="

                    padding:7px 0;

                    font-size:13px;

                  "

                >

                  ${formatMoney(

                    subtotal

                  )}

                </td>

              </tr>





              ${discountRow}

              ${taxRow}





              <tr>

                <td

                  style="

                    padding:7px 0;

                    font-size:13px;

                    color:#77736c;

                  "

                >

                  Shipping

                </td>





                <td

                  align="right"

                  style="

                    padding:7px 0;

                    font-size:13px;

                  "

                >

                  ${

                    shippingCharge === 0

                      ? "FREE"

                      : formatMoney(

                          shippingCharge

                        )

                  }

                </td>

              </tr>





              <tr>

                <td

                  style="

                    padding:16px 0;

                    border-top:1px solid #eeeae2;

                    font-size:16px;

                    font-weight:700;

                    color:#222222;

                  "

                >

                  Total Amount

                </td>





                <td

                  align="right"

                  style="

                    padding:16px 0;

                    border-top:1px solid #eeeae2;

                    font-size:18px;

                    font-weight:700;

                    color:#8b6424;

                  "

                >

                  ${formatMoney(

                    totalAmount

                  )}

                </td>

              </tr>

            </table>

          </td>

        </tr>





        <tr>

          <td

            style="

              padding:24px 24px 0;

            "

          >

            <div

              style="

                padding:16px;

                background:#faf8f3;

                border:1px solid #e8dfd0;

              "

            >

              <div

                style="

                  font-family:Georgia,'Times New Roman',serif;

                  font-size:18px;

                  font-weight:600;

                  color:#49371d;

                "

              >

                Payment Information

              </div>





              <table

                role="presentation"

                width="100%"

                cellspacing="0"

                cellpadding="0"

                border="0"

                style="margin-top:9px;"

              >

                <tr>

                  <td

                    style="

                      padding:6px 0;

                      font-size:13px;

                      color:#77736c;

                    "

                  >

                    Payment Method

                  </td>





                  <td

                    align="right"

                    style="

                      padding:6px 0;

                      font-size:13px;

                      font-weight:600;

                    "

                  >

                    ${

                      paymentMethod ===

                      "prepaid"

                        ? "Prepaid"

                        : "Partial COD"

                    }

                  </td>

                </tr>





                <tr>

                  <td

                    style="

                      padding:6px 0;

                      font-size:13px;

                      color:#77736c;

                    "

                  >

                    Advance Paid

                  </td>





                  <td

                    align="right"

                    style="

                      padding:6px 0;

                      font-size:13px;

                      font-weight:600;

                    "

                  >

                    ${formatMoney(

                      advanceAmount

                    )}

                  </td>

                </tr>





                ${remainingPaymentRow}

              </table>

            </div>

          </td>

        </tr>





        <tr>

          <td

            style="

              padding:24px 24px 0;

            "

          >

            <div

              style="

                padding:16px;

                background:#faf8f3;

                border:1px solid #e8dfd0;

              "

            >

              <div

                style="

                  font-family:Georgia,'Times New Roman',serif;

                  font-size:18px;

                  font-weight:600;

                  color:#49371d;

                "

              >

                Shipping Address

              </div>





              <div

                style="

                  margin-top:11px;

                  font-size:13px;

                  line-height:22px;

                  color:#55514b;

                "

              >

                <strong>

                  ${escapeHtml(

                    shipping.fullName

                  )}

                </strong>

                <br>

                ${escapeHtml(

                  shipping.address

                )}

                <br>

                ${escapeHtml(

                  shipping.city

                )},

                ${escapeHtml(

                  shipping.state

                )}

                —

                ${escapeHtml(

                  shipping.pincode

                )}

                <br>

                ${

                  shipping.landmark

                    ? `Landmark: ${escapeHtml(

                        shipping.landmark

                      )}<br>`

                    : ""

                }

                ${

                  shipping.country

                    ? `${escapeHtml(

                        shipping.country

                      )}<br>`

                    : ""

                }

                Phone:

                ${escapeHtml(

                  shipping.phone

                )}

              </div>

            </div>

          </td>

        </tr>





        ${trackingSection}





        ${deliveredMessage}





        <tr>

          <td

            align="center"

            style="

              padding:32px 24px;

            "

          >

            <div

              style="

                height:1px;

                background:#eeeae2;

                margin-bottom:22px;

              "

            ></div>





            <img

              src="https://wzphyyoftwxvpqxtfgtb.supabase.co/storage/v1/object/public/Logo/MainLogo.png"

              alt="T&amp;M Jewels"

              width="125"

              style="

                display:block;

                width:125px;

                height:auto;

                margin:0 auto;

              "

            />





            <div

              style="

                margin-top:12px;

                font-size:12px;

                line-height:20px;

                color:#999287;

              "

            >

              Need help with your order?

              <br>

              Contact us at

              <strong>

                shop.tnm.official@gmail.com

              </strong>

            </div>





            <div

              style="

                margin-top:14px;

                font-size:11px;

                line-height:18px;

                color:#aaa49a;

              "

            >

              © T&amp;M Jewels. All rights reserved.

            </div>

          </td>

        </tr>





      </table>

    </td>

  </tr>

</table>





</body>

</html>

      `,

    });

  }









  async sendOrderCancellationEmail({

    to,

    customerName,

    orderNumber,

    orderDate,

    cancellationReason,

    items,

    subtotal,

    discount,

    shippingCharge,

    tax,

    totalAmount,

    paymentMethod,

    advanceAmount,

    paymentTransactionId,

    refundStatus,

    refundAmount,

    refundTransactionId,

    refundProcessedAt,

    shipping,

  }: OrderCancellationEmailPayload) {





    const formatMoney = (

      amount: number

    ) =>

      `₹${amount.toLocaleString(

        "en-IN",

        {

          minimumFractionDigits: 2,

          maximumFractionDigits: 2,

        }

      )}`;





    const escapeHtml = (

      value: string

    ) =>

      value

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");





    const formattedDate =

      new Date(

        orderDate

      ).toLocaleDateString(

        "en-IN",

        {

          day:
            "numeric",

          month:
            "long",

          year:
            "numeric",

        }

      );





    const formattedRefundDate =

      refundProcessedAt

        ? new Date(

            refundProcessedAt

          ).toLocaleDateString(

            "en-IN",

            {

              day:
                "numeric",

              month:
                "long",

              year:
                "numeric",

            }

          )

        : null;





    const productRows = items

      .map(

        item => `

          <tr>

            <td

              style="

                padding:15px 8px 15px 0;

                border-bottom:1px solid #eeeae2;

              "

            >

              <table

                role="presentation"

                cellspacing="0"

                cellpadding="0"

                border="0"

              >

                <tr>

                  <td

                    style="

                      width:65px;

                      vertical-align:middle;

                    "

                  >

                    ${

                      item.productImage

                        ? `

                          <img

                            src="${escapeHtml(

                              item.productImage

                            )}"

                            alt="${escapeHtml(

                              item.productName

                            )}"

                            width="65"

                            height="65"

                            style="

                              display:block;

                              width:65px;

                              height:65px;

                              object-fit:cover;

                              border-radius:9px;

                              border:1px solid #eee7da;

                            "

                          />

                        `

                        : `

                          <div

                            style="

                              width:65px;

                              height:65px;

                              background:#f7f3eb;

                              border-radius:9px;

                              border:1px solid #eee7da;

                            "

                          ></div>

                        `

                    }

                  </td>





                  <td

                    style="

                      padding-left:12px;

                      vertical-align:middle;

                    "

                  >

                    <div

                      style="

                        font-size:14px;

                        line-height:20px;

                        font-weight:600;

                        color:#222222;

                      "

                    >

                      ${escapeHtml(

                        item.productName

                      )}

                    </div>





                    <div

                      style="

                        margin-top:4px;

                        font-size:12px;

                        color:#8c877e;

                      "

                    >

                      Qty: ${item.quantity}

                    </div>

                  </td>

                </tr>

              </table>

            </td>





            <td

              align="right"

              style="

                padding:15px 0;

                border-bottom:1px solid #eeeae2;

                font-size:14px;

                font-weight:600;

                color:#222222;

                white-space:nowrap;

              "

            >

              ${formatMoney(

                item.total

              )}

            </td>

          </tr>

        `

      )

      .join("");





    const discountRow =

      discount > 0

        ? `

          <tr>

            <td

              style="

                padding:7px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Discount

            </td>





            <td

              align="right"

              style="

                padding:7px 0;

                font-size:13px;

                color:#4f7b45;

              "

            >

              -${formatMoney(

                discount

              )}

            </td>

          </tr>

        `

        : "";





    const taxRow =

      tax > 0

        ? `

          <tr>

            <td

              style="

                padding:7px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Tax

            </td>





            <td

              align="right"

              style="

                padding:7px 0;

                font-size:13px;

              "

            >

              ${formatMoney(

                tax

              )}

            </td>

          </tr>

        `

        : "";





    const paymentTransactionRow =

      paymentTransactionId

        ? `

          <tr>

            <td

              style="

                padding:6px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Payment Transaction ID

            </td>





            <td

              align="right"

              style="

                padding:6px 0;

                font-size:12px;

                font-weight:600;

                word-break:break-all;

              "

            >

              ${escapeHtml(

                paymentTransactionId

              )}

            </td>

          </tr>

        `

        : "";





    const refundStatusLabel =

      refundStatus === "processed"

        ? "Refund Processed"

        : refundStatus === "pending"

        ? "Refund Pending"

        : refundStatus === "failed"

        ? "Refund Failed"

        : "No Refund Required";





    const refundStatusColor =

      refundStatus === "processed"

        ? "#4f7b45"

        : refundStatus === "failed"

        ? "#a94442"

        : "#8b6424";





    const refundTransactionRow =

      refundTransactionId

        ? `

          <tr>

            <td

              style="

                padding:7px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Refund Reference

            </td>





            <td

              align="right"

              style="

                padding:7px 0;

                font-size:12px;

                font-weight:600;

                word-break:break-all;

              "

            >

              ${escapeHtml(

                refundTransactionId

              )}

            </td>

          </tr>

        `

        : "";





    const refundProcessedDateRow =

      formattedRefundDate

        ? `

          <tr>

            <td

              style="

                padding:7px 0;

                font-size:13px;

                color:#77736c;

              "

            >

              Refund Processed On

            </td>





            <td

              align="right"

              style="

                padding:7px 0;

                font-size:13px;

                font-weight:600;

              "

            >

              ${formattedRefundDate}

            </td>

          </tr>

        `

        : "";





    const refundMessage =

      refundStatus === "processed"

        ? `

          <div

            style="

              margin-top:12px;

              font-size:13px;

              line-height:21px;

              color:#5f5a53;

            "

          >

            Your refund has been processed successfully.

            Please keep the refund reference above for

            your records.

          </div>

        `

        : refundStatus === "pending"

        ? `

          <div

            style="

              margin-top:12px;

              font-size:13px;

              line-height:21px;

              color:#5f5a53;

            "

          >

            Your refund is currently pending. We will

            process the refund and update you once it

            has been completed.

          </div>

        `

        : refundStatus === "failed"

        ? `

          <div

            style="

              margin-top:12px;

              font-size:13px;

              line-height:21px;

              color:#8a3d3d;

            "

          >

            We were unable to complete the refund at

            this time. Our team will review it and

            contact you if any further action is needed.

          </div>

        `

        : `

          <div

            style="

              margin-top:12px;

              font-size:13px;

              line-height:21px;

              color:#5f5a53;

            "

          >

            No refund is required for this order.

          </div>

        `;





    return this.sendEmail({

      to,





      subject:
        `T&M Jewels — Your Order Has Been Cancelled #${orderNumber}`,





      html: `

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta

    name="viewport"

    content="width=device-width, initial-scale=1.0"

  >

  <meta

    name="color-scheme"

    content="light"

  >

  <meta

    name="supported-color-schemes"

    content="light"

  >

  <title>

    T&amp;M Jewels — Order Cancelled

  </title>

</head>





<body

  style="

    margin:0;

    padding:0;

    background:#f5f3ef;

    color:#222222;

    font-family:Arial,Helvetica,sans-serif;

    -webkit-text-size-adjust:100%;

  "

>





<table

  role="presentation"

  width="100%"

  cellspacing="0"

  cellpadding="0"

  border="0"

  style="background:#f5f3ef;"

>

  <tr>

    <td

      align="center"

      style="padding:28px 12px;"

    >

      <table

        role="presentation"

        width="100%"

        cellspacing="0"

        cellpadding="0"

        border="0"

        style="

          width:100%;

          max-width:640px;

          background:#ffffff;

          border:1px solid #e9e3d8;

        "

      >

        <!-- LOGO -->

        <tr>

          <td

            align="center"

            style="

              padding:30px 20px 24px;

              border-bottom:1px solid #eeeae2;

            "

          >

            <img

              src="https://wzphyyoftwxvpqxtfgtb.supabase.co/storage/v1/object/public/Logo/MainLogo.png"

              alt="T&amp;M Jewels"

              width="190"

              style="

                display:block;

                width:190px;

                max-width:80%;

                height:auto;

                margin:0 auto;

              "

            />





            <div

              style="

                margin-top:10px;

                font-size:11px;

                line-height:18px;

                letter-spacing:1.5px;

                color:#999287;

                text-transform:uppercase;

              "

            >

              Create your own style. Create your own trend.

            </div>

          </td>

        </tr>





        <!-- CANCELLED HEADER -->

        <tr>

          <td

            align="center"

            style="padding:36px 24px 22px;"

          >

            <div

              style="

                width:58px;

                height:58px;

                line-height:58px;

                border-radius:50%;

                background:#fbf1ef;

                color:#a95d55;

                font-size:25px;

                font-weight:bold;

              "

            >

              ×

            </div>





            <h1

              style="

                margin:18px 0 8px;

                font-family:Georgia,'Times New Roman',serif;

                font-size:29px;

                line-height:37px;

                font-weight:600;

                color:#8b6424;

              "

            >

              Your Order Has Been Cancelled

            </h1>





            <p

              style="

                margin:0;

                font-size:14px;

                line-height:23px;

                color:#6e6a63;

              "

            >

              Dear ${escapeHtml(

                customerName

              )},<br>

              Your order has been cancelled as requested.

            </p>

          </td>

        </tr>





        <!-- ORDER INFO -->

        <tr>

          <td

            style="padding:4px 24px 20px;"

          >

            <table

              role="presentation"

              width="100%"

              cellspacing="0"

              cellpadding="0"

              border="0"

              style="

                background:#faf8f3;

                border:1px solid #e8dfd0;

              "

            >

              <tr>

                <td

                  width="50%"

                  style="

                    padding:17px;

                    border-right:1px solid #e5ddcf;

                  "

                >

                  <div

                    style="

                      font-size:10px;

                      line-height:16px;

                      color:#9c968c;

                      text-transform:uppercase;

                      letter-spacing:1.2px;

                    "

                  >

                    Order Number

                  </div>





                  <div

                    style="

                      margin-top:5px;

                      font-size:16px;

                      line-height:22px;

                      font-weight:600;

                      color:#222222;

                    "

                  >

                    #${escapeHtml(

                      orderNumber

                    )}

                  </div>

                </td>





                <td

                  width="50%"

                  style="padding:17px;"

                >

                  <div

                    style="

                      font-size:10px;

                      line-height:16px;

                      color:#9c968c;

                      text-transform:uppercase;

                      letter-spacing:1.2px;

                    "

                  >

                    Order Date

                  </div>





                  <div

                    style="

                      margin-top:5px;

                      font-size:14px;

                      line-height:22px;

                      font-weight:600;

                      color:#222222;

                    "

                  >

                    ${formattedDate}

                  </div>

                </td>

              </tr>

            </table>

          </td>

        </tr>





        <!-- CANCELLATION REASON -->

        <tr>

          <td

            style="padding:0 24px;"

          >

            <div

              style="

                padding:16px;

                background:#fbf8f3;

                border-left:3px solid #c8a44d;

              "

            >

              <div

                style="

                  font-family:Georgia,'Times New Roman',serif;

                  font-size:18px;

                  font-weight:600;

                  color:#49371d;

                "

              >

                Cancellation Details

              </div>





              <div

                style="

                  margin-top:10px;

                  font-size:13px;

                  line-height:22px;

                  color:#5f5a53;

                "

              >

                <strong>

                  Reason:

                </strong>

                ${escapeHtml(

                  cancellationReason ||

                  "Order cancelled by customer/request."

                )}

              </div>

            </div>

          </td>

        </tr>





        <!-- ORDER DETAILS -->

        <tr>

          <td

            style="padding:24px 24px 0;"

          >

            <div

              style="

                padding:13px 16px;

                background:#f7f1e5;

                color:#59431f;

                font-family:Georgia,'Times New Roman',serif;

                font-size:20px;

                line-height:28px;

                font-weight:600;

              "

            >

              Order Details

            </div>





            <table

              role="presentation"

              width="100%"

              cellspacing="0"

              cellpadding="0"

              border="0"

            >

              <tr>

                <td

                  style="

                    padding:12px 0;

                    font-size:11px;

                    font-weight:600;

                    color:#999287;

                    text-transform:uppercase;

                    letter-spacing:.7px;

                    border-bottom:1px solid #eeeae2;

                  "

                >

                  Product

                </td>





                <td

                  align="right"

                  style="

                    padding:12px 0;

                    font-size:11px;

                    font-weight:600;

                    color:#999287;

                    text-transform:uppercase;

                    letter-spacing:.7px;

                    border-bottom:1px solid #eeeae2;

                  "

                >

                  Amount

                </td>

              </tr>





              ${productRows}

            </table>

          </td>

        </tr>





        <!-- TOTALS -->

        <tr>

          <td

            style="

              padding:22px 24px 0;

            "

          >

            <table

              role="presentation"

              width="100%"

              cellspacing="0"

              cellpadding="0"

              border="0"

              style="

                border-top:1px solid #eeeae2;

                border-bottom:1px solid #eeeae2;

              "

            >

              <tr>

                <td

                  style="

                    padding:7px 0;

                    font-size:13px;

                    color:#77736c;

                  "

                >

                  Subtotal

                </td>





                <td

                  align="right"

                  style="

                    padding:7px 0;

                    font-size:13px;

                  "

                >

                  ${formatMoney(

                    subtotal

                  )}

                </td>

              </tr>





              ${discountRow}

              ${taxRow}





              <tr>

                <td

                  style="

                    padding:7px 0;

                    font-size:13px;

                    color:#77736c;

                  "

                >

                  Shipping

                </td>





                <td

                  align="right"

                  style="

                    padding:7px 0;

                    font-size:13px;

                  "

                >

                  ${

                    shippingCharge === 0

                      ? "FREE"

                      : formatMoney(

                          shippingCharge

                        )

                  }

                </td>

              </tr>





              <tr>

                <td

                  style="

                    padding:16px 0;

                    border-top:1px solid #eeeae2;

                    font-size:16px;

                    font-weight:700;

                    color:#222222;

                  "

                >

                  Total Amount

                </td>





                <td

                  align="right"

                  style="

                    padding:16px 0;

                    border-top:1px solid #eeeae2;

                    font-size:18px;

                    font-weight:700;

                    color:#8b6424;

                  "

                >

                  ${formatMoney(

                    totalAmount

                  )}

                </td>

              </tr>

            </table>

          </td>

        </tr>





        <!-- PAYMENT -->

        <tr>

          <td

            style="

              padding:24px 24px 0;

            "

          >

            <div

              style="

                padding:16px;

                background:#faf8f3;

                border:1px solid #e8dfd0;

              "

            >

              <div

                style="

                  font-family:Georgia,'Times New Roman',serif;

                  font-size:18px;

                  font-weight:600;

                  color:#49371d;

                "

              >

                Payment Information

              </div>





              <table

                role="presentation"

                width="100%"

                cellspacing="0"

                cellpadding="0"

                border="0"

                style="margin-top:9px;"

              >

                <tr>

                  <td

                    style="

                      padding:6px 0;

                      font-size:13px;

                      color:#77736c;

                    "

                  >

                    Payment Method

                  </td>





                  <td

                    align="right"

                    style="

                      padding:6px 0;

                      font-size:13px;

                      font-weight:600;

                    "

                  >

                    ${

                      paymentMethod ===

                      "prepaid"

                        ? "Prepaid"

                        : "Partial COD"

                    }

                  </td>

                </tr>





                <tr>

                  <td

                    style="

                      padding:6px 0;

                      font-size:13px;

                      color:#77736c;

                    "

                  >

                    Amount Paid

                  </td>





                  <td

                    align="right"

                    style="

                      padding:6px 0;

                      font-size:13px;

                      font-weight:600;

                    "

                  >

                    ${formatMoney(

                      advanceAmount

                    )}

                  </td>

                </tr>





                ${

                  paymentTransactionRow

                }

              </table>

            </div>

          </td>

        </tr>





        <!-- REFUND -->

        <tr>

          <td

            style="

              padding:24px 24px 0;

            "

          >

            <div

              style="

                padding:18px;

                background:#faf8f3;

                border:1px solid #e8dfd0;

              "

            >

              <div

                style="

                  font-family:Georgia,'Times New Roman',serif;

                  font-size:19px;

                  font-weight:600;

                  color:#49371d;

                "

              >

                Refund Information

              </div>





              <table

                role="presentation"

                width="100%"

                cellspacing="0"

                cellpadding="0"

                border="0"

                style="margin-top:10px;"

              >

                <tr>

                  <td

                    style="

                      padding:7px 0;

                      font-size:13px;

                      color:#77736c;

                    "

                  >

                    Refund Status

                  </td>





                  <td

                    align="right"

                    style="

                      padding:7px 0;

                      font-size:13px;

                      font-weight:700;

                      color:${refundStatusColor};

                    "

                  >

                    ${refundStatusLabel}

                  </td>

                </tr>





                <tr>

                  <td

                    style="

                      padding:7px 0;

                      font-size:13px;

                      color:#77736c;

                    "

                  >

                    Refund Amount

                  </td>





                  <td

                    align="right"

                    style="

                      padding:7px 0;

                      font-size:15px;

                      font-weight:700;

                      color:#8b6424;

                    "

                  >

                    ${formatMoney(

                      refundAmount

                    )}

                  </td>

                </tr>





                ${refundTransactionRow}

                ${refundProcessedDateRow}

              </table>





              ${refundMessage}

            </div>

          </td>

        </tr>





        <!-- SHIPPING ADDRESS -->

        <tr>

          <td

            style="

              padding:24px 24px 0;

            "

          >

            <div

              style="

                padding:16px;

                background:#faf8f3;

                border:1px solid #e8dfd0;

              "

            >

              <div

                style="

                  font-family:Georgia,'Times New Roman',serif;

                  font-size:18px;

                  font-weight:600;

                  color:#49371d;

                "

              >

                Shipping Address

              </div>





              <div

                style="

                  margin-top:11px;

                  font-size:13px;

                  line-height:22px;

                  color:#55514b;

                "

              >

                <strong>

                  ${escapeHtml(

                    shipping.fullName

                  )}

                </strong>

                <br>

                ${escapeHtml(

                  shipping.address

                )}

                <br>

                ${escapeHtml(

                  shipping.city

                )},

                ${escapeHtml(

                  shipping.state

                )}

                —

                ${escapeHtml(

                  shipping.pincode

                )}

                <br>

                ${

                  shipping.landmark

                    ? `Landmark: ${escapeHtml(

                        shipping.landmark

                      )}<br>`

                    : ""

                }

                ${

                  shipping.country

                    ? `${escapeHtml(

                        shipping.country

                      )}<br>`

                    : ""

                }

                Phone:

                ${escapeHtml(

                  shipping.phone

                )}

              </div>

            </div>

          </td>

        </tr>





        <!-- FOOTER -->

        <tr>

          <td

            align="center"

            style="

              padding:32px 24px;

            "

          >

            <div

              style="

                height:1px;

                background:#eeeae2;

                margin-bottom:22px;

              "

            ></div>





            <img

              src="https://wzphyyoftwxvpqxtfgtb.supabase.co/storage/v1/object/public/Logo/MainLogo.png"

              alt="T&amp;M Jewels"

              width="125"

              style="

                display:block;

                width:125px;

                height:auto;

                margin:0 auto;

              "

            />





            <div

              style="

                margin-top:12px;

                font-size:12px;

                line-height:20px;

                color:#999287;

              "

            >

              Need help with your order?

              <br>

              Contact us at

              <strong>

                shop.tnm.official@gmail.com

              </strong>

            </div>





            <div

              style="

                margin-top:14px;

                font-size:11px;

                line-height:18px;

                color:#aaa49a;

              "

            >

              © T&amp;M Jewels. All rights reserved.

            </div>

          </td>

        </tr>





      </table>

    </td>

  </tr>

</table>





</body>

</html>

      `,

    });

  }
async sendRefundProcessedEmail(
    payload: RefundProcessedEmailPayload
  ) {   
    const { to, customerName, orderNumber, items, subtotal, discount, shippingCharge, tax, totalAmount, paymentMethod, paymentTransactionId, refundAmount, refundTransactionId, refundProcessedAt, shipping } = payload;
    const money = (n:number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const esc = (v:string) => v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
    const date = (v:string) => new Date(v).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });
    const rows = items.map(i => `<tr><td style="padding:15px 8px 15px 0;border-bottom:1px solid #eeeae2"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="width:65px">${i.productImage ? `<img src="${esc(i.productImage)}" width="65" height="65" style="display:block;width:65px;height:65px;object-fit:cover;border-radius:9px;border:1px solid #eee7da" />` : `<div style="width:65px;height:65px;background:#f7f3eb;border-radius:9px;border:1px solid #eee7da"></div>`}</td><td style="padding-left:12px"><div style="font-size:14px;font-weight:600">${esc(i.productName)}</div><div style="margin-top:4px;font-size:12px;color:#8c877e">Qty: ${i.quantity}</div></td></tr></table></td><td align="right" style="padding:15px 0;border-bottom:1px solid #eeeae2;font-size:14px;font-weight:600">${money(i.total)}</td></tr>`).join("");
    const discountRow = discount > 0 ? `<tr><td style="padding:7px 0;color:#77736c">Discount</td><td align="right" style="padding:7px 0;color:#4f7b45">-${money(discount)}</td></tr>` : "";
    const taxRow = tax > 0 ? `<tr><td style="padding:7px 0;color:#77736c">Tax</td><td align="right" style="padding:7px 0">${money(tax)}</td></tr>` : "";
    const transactionRow = paymentTransactionId ? `<tr><td style="padding:7px 0;color:#77736c">Payment Transaction ID</td><td align="right" style="padding:7px 0;font-size:12px;font-weight:600;word-break:break-all">${esc(paymentTransactionId)}</td></tr>` : "";
    return this.sendEmail({ to, subject:`T&M Jewels — Your Refund Has Been Processed #${orderNumber}`, html:`<!DOCTYPE html><html><body style="margin:0;background:#f5f3ef;font-family:Arial,Helvetica,sans-serif;color:#222"><table role="presentation" width="100%"><tr><td align="center" style="padding:28px 12px"><table role="presentation" width="100%" style="max-width:640px;background:#fff;border:1px solid #e9e3d8"><tr><td align="center" style="padding:30px 20px 24px;border-bottom:1px solid #eeeae2"><img src="https://wzphyyoftwxvpqxtfgtb.supabase.co/storage/v1/object/public/Logo/MainLogo.png" width="190" style="display:block;max-width:80%;height:auto;margin:auto"><div style="margin-top:10px;font-size:11px;letter-spacing:1.5px;color:#999287;text-transform:uppercase">Create your own style. Create your own trend.</div></td></tr><tr><td align="center" style="padding:36px 24px 22px"><div style="margin:auto;width:58px;height:58px;line-height:58px;border-radius:50%;background:#f3f7ef;color:#4d8a4b;font-size:28px;font-weight:bold">✓</div><h1 style="margin:18px 0 8px;font-family:Georgia,serif;font-size:29px;color:#8b6424">Refund Successfully Processed</h1><p style="margin:0;font-size:14px;line-height:23px;color:#6e6a63">Dear ${esc(customerName)},<br>Your refund has been successfully processed.</p></td></tr><tr><td style="padding:4px 24px 20px"><table width="100%" style="background:#faf8f3;border:1px solid #e8dfd0"><tr><td width="50%" style="padding:17px;border-right:1px solid #e5ddcf"><small style="color:#9c968c">ORDER NUMBER</small><div style="margin-top:5px;font-weight:600">#${esc(orderNumber)}</div></td><td style="padding:17px"><small style="color:#9c968c">REFUND DATE</small><div style="margin-top:5px;font-weight:600">${date(refundProcessedAt)}</div></td></tr></table></td></tr><tr><td style="padding:0 24px"><div style="padding:20px;background:#f3f7ef;border:1px solid #dce9d6;text-align:center"><div style="font-size:11px;color:#77736c;text-transform:uppercase">REFUND AMOUNT</div><div style="margin-top:7px;font-family:Georgia,serif;font-size:30px;color:#4f7b45">${money(refundAmount)}</div><div style="margin-top:8px;font-size:13px;color:#66625c">The refund has been processed successfully.</div></div></td></tr><tr><td style="padding:24px 24px 0"><div style="padding:18px;background:#faf8f3;border:1px solid #e8dfd0"><h2 style="font-family:Georgia,serif;color:#49371d">Refund Details</h2><table width="100%"><tr><td style="padding:7px 0;color:#77736c">Refund Reference</td><td align="right" style="font-size:12px;font-weight:600;word-break:break-all">${esc(refundTransactionId)}</td></tr><tr><td style="padding:7px 0;color:#77736c">Refund Processed On</td><td align="right" style="font-weight:600">${date(refundProcessedAt)}</td></tr><tr><td style="padding:7px 0;color:#77736c">Payment Method</td><td align="right" style="font-weight:600">${paymentMethod === "prepaid" ? "Prepaid" : "Partial COD"}</td></tr>${transactionRow}</table></div></td></tr><tr><td style="padding:24px 24px 0"><div style="padding:13px 16px;background:#f7f1e5;color:#59431f;font-family:Georgia,serif;font-size:20px;font-weight:600">Original Order</div><table width="100%"><tr><td style="padding:12px 0;color:#999287">Product</td><td align="right" style="padding:12px 0;color:#999287">Amount</td></tr>${rows}</table></td></tr><tr><td style="padding:22px 24px 0"><table width="100%" style="border-top:1px solid #eeeae2;border-bottom:1px solid #eeeae2"><tr><td style="padding:7px 0;color:#77736c">Subtotal</td><td align="right">${money(subtotal)}</td></tr>${discountRow}${taxRow}<tr><td style="padding:7px 0;color:#77736c">Shipping</td><td align="right">${shippingCharge === 0 ? "FREE" : money(shippingCharge)}</td></tr><tr><td style="padding:16px 0;border-top:1px solid #eeeae2;font-size:16px;font-weight:700">Original Order Total</td><td align="right" style="padding:16px 0;border-top:1px solid #eeeae2;font-size:18px;font-weight:700;color:#8b6424">${money(totalAmount)}</td></tr></table></td></tr><tr><td style="padding:24px 24px 0"><div style="padding:16px;background:#faf8f3;border:1px solid #e8dfd0"><h2 style="font-family:Georgia,serif;color:#49371d">Shipping Address</h2><div style="font-size:13px;line-height:22px;color:#55514b"><strong>${esc(shipping.fullName)}</strong><br>${esc(shipping.address)}<br>${esc(shipping.city)}, ${esc(shipping.state)} — ${esc(shipping.pincode)}<br>${shipping.landmark ? `Landmark: ${esc(shipping.landmark)}<br>` : ""}${shipping.country ? `${esc(shipping.country)}<br>` : ""}Phone: ${esc(shipping.phone)}</div></div></td></tr><tr><td align="center" style="padding:32px 24px"><div style="height:1px;background:#eeeae2;margin-bottom:22px"></div><img src="https://wzphyyoftwxvpqxtfgtb.supabase.co/storage/v1/object/public/Logo/MainLogo.png" width="125" style="display:block;width:125px;height:auto;margin:auto"><div style="margin-top:12px;font-size:12px;color:#999287">Need help with your order?<br>Contact us at <strong>shop.tnm.official@gmail.com</strong></div><div style="margin-top:14px;font-size:11px;color:#aaa49a">© T&amp;M Jewels. All rights reserved.</div></td></tr></table></td></tr></table></body></html>` });  }
}





export const notificationService =

  new NotificationService();