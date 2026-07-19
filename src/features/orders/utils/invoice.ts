import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import logo from "@/assets/logo.png";

import type {
  Order,
  OrderItem,
} from "../types/order.types";

const PAGE_WIDTH = 210;
const LEFT = 15;

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function imageToDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = reject;
    img.src = src;
  });
}
async function loadImage(
  src: string | null | undefined
): Promise<string | null> {
  if (!src) return null;

  return new Promise((resolve) => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/jpeg"));
    };

    img.onerror = () => resolve(null);

    img.src = src;
  });
}
function formatPaymentMethod(method: string) {
  switch (method) {
    case "partial_cod":
      return "Partial COD";
    case "prepaid":
      return "Prepaid";
    default:
      return method;
  }
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
export async function generateInvoicePDF(
  order: Order,
  items: OrderItem[]
) {
  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const logoData = await imageToDataUrl(logo);

  pdf.addImage(
    logoData,
    "PNG",
    15,
    10,
    25,
    25
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("TNM JEWELS", 45, 20);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120);

  pdf.text(
    "Premium Anti-Tarnish Jewellery",
    45,
    27
  );

  pdf.setDrawColor(220);
  pdf.line(15, 40, 195, 40);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(30);

  pdf.text("INVOICE", 195, 18, {
    align: "right",
  });

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  pdf.text(
    `Invoice : ${order.order_number}`,
    195,
    26,
    {
      align: "right",
    }
  );

  pdf.text(
    `Date : ${formatDate(order.created_at)}`,
    195,
    32,
    {
      align: "right",
    }
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);

  pdf.text("Customer", LEFT, 52);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let y = 59;

  pdf.text(
    order.customer_name,
    LEFT,
    y
  );

  y += 6;

  pdf.text(
    order.customer_phone,
    LEFT,
    y
  );

  if (order.customer_email) {
    y += 6;

    pdf.text(
      order.customer_email,
      LEFT,
      y
    );
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);

  pdf.text(
    "Shipping Address",
    110,
    52
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let sy = 59;

  pdf.text(
    order.shipping_full_name ?? "-",
    110,
    sy
  );

  sy += 6;

  pdf.text(
    order.shipping_phone ?? "-",
    110,
    sy
  );

  sy += 6;

  pdf.text(
    order.shipping_address ?? "-",
    110,
    sy
  );

  sy += 6;

  pdf.text(
    `${order.shipping_city ?? ""}, ${
      order.shipping_state ?? ""
    }`,
    110,
    sy
  );

  sy += 6;

  pdf.text(
    `${order.shipping_country ?? ""} ${
      order.shipping_pincode ?? ""
    }`,
    110,
    sy
  );

  let startY = Math.max(y, sy) + 15;

  const imageCache = await Promise.all(
  items.map((item) => loadImage(item.product_image))
);

autoTable(pdf, {
  startY,

  head: [["Image", "Product", "Qty", "Price", "Total"]],

  body: items.map((item) => [
    "",
    item.product_name,
    item.quantity.toString(),
    money(item.price),
    money(item.total),
  ]),

  styles: {
    fontSize: 10,
    cellPadding: 3,
    valign: "middle",
  },

  headStyles: {
    fillColor: [18, 18, 18],
    textColor: 255,
    fontStyle: "bold",
  },

  alternateRowStyles: {
    fillColor: [248, 248, 248],
  },

  columnStyles: {
    0: { cellWidth: 20 },
    2: { halign: "center", cellWidth: 18 },
    3: { halign: "right", cellWidth: 28 },
    4: { halign: "right", cellWidth: 30 },
  },

  // 👇 Add it here
  didDrawCell(data) {
    if (
      data.section === "body" &&
      data.column.index === 0
    ) {
      const img = imageCache[data.row.index];

      if (!img) return;

      pdf.addImage(
        img,
        "JPEG",
        data.cell.x + 2,
        data.cell.y + 2,
        10,
        10
      );
    }
  },
});

  const finalY =
    (pdf as jsPDF & {
      lastAutoTable?: {
        finalY: number;
      };
    }).lastAutoTable?.finalY ?? startY;

  let summaryY = finalY + 12;

  pdf.setDrawColor(220);
  pdf.line(120, summaryY - 5, 195, summaryY - 5);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

const drawRow = (
  label: string,
  value: string,
  options?: {
    bold?: boolean;
    highlight?: boolean;
  }
) => {
  if (options?.highlight) {
    pdf.setFillColor(247, 229, 183); // Light gold
    pdf.roundedRect(118, summaryY - 5, 78, 9, 2, 2, "F");
  }

  pdf.setFont(
    "helvetica",
    options?.bold ? "bold" : "normal"
  );

  pdf.setTextColor(40);

  pdf.text(label, 122, summaryY);

  pdf.text(value, 192, summaryY, {
    align: "right",
  });

  summaryY += 8;
};

  drawRow("Subtotal", money(order.subtotal));

drawRow("Discount", money(order.discount));

drawRow("Shipping", money(order.shipping_charge));

drawRow("Advance Paid", money(order.advance_amount));

drawRow("COD Due", money(order.remaining_amount));

summaryY += 2;

drawRow(
  "Grand Total",
  money(order.total_amount),
  {
    bold: true,
    highlight: true,
  }
);

  summaryY += 5;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);

  pdf.text(
    "Payment Details",
    LEFT,
    summaryY
  );

  summaryY += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  pdf.text(
    `Payment Method : ${formatPaymentMethod(order.payment_method)}`,
    LEFT,
    summaryY
  );

  summaryY += 6;

  pdf.text(
    `Advance Status : ${formatStatus(order.advance_payment_status)}`,
    LEFT,
    summaryY
  );

  summaryY += 6;

  pdf.text(
    `COD Status : ${formatStatus(order.cod_payment_status)}`,
    LEFT,
    summaryY
  );

  summaryY += 6;

  pdf.text(
    `Order Status : ${formatStatus(order.order_status)}`,
    LEFT,
    summaryY
  );

  summaryY += 15;

  pdf.setDrawColor(220);
  pdf.line(15, summaryY, 195, summaryY);

  summaryY += 10;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);

  pdf.text(
    "Thank you for shopping with TNM Jewels ❤️",
    PAGE_WIDTH / 2,
    summaryY,
    {
      align: "center",
    }
  );

  summaryY += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(120);

  pdf.text(
    "Premium Anti-Tarnish Jewellery",
    PAGE_WIDTH / 2,
    summaryY,
    {
      align: "center",
    }
  );

  summaryY += 5;

  pdf.text(
    "www.tnmjewels.com",
    PAGE_WIDTH / 2,
    summaryY,
    {
      align: "center",
    }
  );

  pdf.save(
    `Invoice-${order.order_number}.pdf`
  );
}