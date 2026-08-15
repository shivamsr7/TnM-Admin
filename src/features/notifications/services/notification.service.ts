import { supabase } from "@/lib/supabase";





type OrderStatusEmailStatus =
  | "packed"
  | "shipped"
  | "delivered";





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
    "📧 Sending order status email:",
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
    "✅ Order status email sent:",
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

              alt="T&M Jewels"

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





        <!-- STATUS HEADER -->

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





        <!-- ORDER INFO -->

        <tr>

          <td

            style="

              padding:4px 24px 20px;

            "

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





        <!-- ORDER DETAILS -->

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





        <!-- TRACKING -->

        ${trackingSection}





        <!-- DELIVERED MESSAGE -->

        ${deliveredMessage}





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

              alt="T&M Jewels"

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

}





export const notificationService =
  new NotificationService();