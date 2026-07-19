import jsPDF from "jspdf";
import QRCode from "qrcode";
import logo from "@/assets/logo.png";

import type { Order } from "../types/order.types";

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
async function generateQRCode(
  text: string
): Promise<string> {
  return await QRCode.toDataURL(text, {
    margin: 1,
    width: 300,
  });
}
function paymentMethod(method: string) {
  switch (method) {
    case "partial_cod":
      return "Partial COD";
    case "prepaid":
      return "Prepaid";
    default:
      return method;
  }
}
const COMPANY = {
  name: "TNM JEWELS",
  phone: "+91 88699 66948",
};
export async function generateShippingLabel(order: Order) {
  // 4 x 6 inch label
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [152.4, 101.6],
  });

  const logoData = await imageToDataUrl(logo);
const qrData = await generateQRCode(
  order.order_number
);
  pdf.addImage(
    logoData,
    "PNG",
    8,
    6,
    16,
    16
  );

 pdf.setFont("helvetica", "bold");
pdf.setFontSize(15);
pdf.text("TNM JEWELS", 28, 12);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(9);
pdf.text("SHIPPING LABEL", 28, 18);

pdf.setDrawColor(210);
pdf.line(8, 25, 94, 25);

pdf.setFont("helvetica", "bold");
pdf.setFontSize(8);
pdf.text("FROM", 8, 30);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(7);

pdf.text(COMPANY.name, 8, 34);
pdf.text(COMPANY.phone, 8, 42);

pdf.setDrawColor(210);
pdf.line(8, 46, 94, 46);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);

  pdf.text("ORDER", 8, 52);

  pdf.setFont("helvetica", "normal");

 pdf.text(order.order_number, 28, 52);

  pdf.setFont("helvetica", "bold");
  pdf.text("COURIER", 8, 59);

  pdf.setFont("helvetica", "normal");
  pdf.text(order.courier_name || "-", 28, 59);

  pdf.setFont("helvetica", "bold");
  pdf.text("TRACKING", 8, 66);

  pdf.setFont("helvetica", "normal");
  pdf.text(order.tracking_number || "-", 28, 66);

  pdf.setDrawColor(200);
  pdf.line(8, 72, 94, 72);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);

  pdf.text("SHIP TO", 8, 80);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let y = 87;

  pdf.text(
    order.shipping_full_name || order.customer_name,
    8,
    y
  );

  y += 6;

  pdf.text(
    order.shipping_phone || order.customer_phone,
    8,
    y
  );
if (order.address_type) {
  pdf.setFillColor(235, 235, 235);

  pdf.roundedRect(
    72,
    y - 4,
    18,
    6,
    1,
    1,
    "F"
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);

  pdf.text(
    order.address_type.toUpperCase(),
    81,
    y,
    {
      align: "center",
    }
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
}
  y += 6;

  if (order.shipping_address) {
    const address = pdf.splitTextToSize(
      order.shipping_address,
      82
    );

    pdf.text(address, 8, y);

    y += address.length * 5;
  }

  pdf.text(
    `${order.shipping_city ?? ""}, ${order.shipping_state ?? ""}`,
    8,
    y
  );

  y += 6;

  pdf.text(
    `${order.shipping_country ?? ""} ${order.shipping_pincode ?? ""}`,
    8,
    y
  );

  y += 10;

  pdf.setDrawColor(200);
  pdf.line(8, y, 94, y);

  y += 8;

  pdf.setFont("helvetica", "bold");

  pdf.text("PAYMENT", 8, y);

  pdf.setFont("helvetica", "normal");

  pdf.text(
    paymentMethod(order.payment_method),
    35,
    y
  );

  y += 7;

  if (order.payment_method === "partial_cod") {
    pdf.setFillColor(255, 244, 204);

pdf.roundedRect(
  8,
  y - 5,
  84,
  12,
  2,
  2,
  "F"
);

pdf.setFont("helvetica", "bold");
pdf.setFontSize(11);

pdf.text("COLLECT", 12, y + 1);

pdf.setFontSize(14);

pdf.text(
  `Rs. ${order.remaining_amount.toLocaleString("en-IN")}`,
  88,
  y + 1,
  {
    align: "right",
  }
);
  }
// QR Code Box
pdf.setDrawColor(200);

pdf.roundedRect(
  62,
  120,
  30,
  30,
  2,
  2
);

pdf.addImage(
  qrData,
  "PNG",
  64,
  122,
  26,
  26
);

pdf.setFont("helvetica", "bold");
pdf.setFontSize(7);

pdf.text(
  "SCAN ORDER",
  77,
  154,
  {
    align: "center",
  }
);
  pdf.save(
    `ShippingLabel-${order.order_number}.pdf`
  );
}