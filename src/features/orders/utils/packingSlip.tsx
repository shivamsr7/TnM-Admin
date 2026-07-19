import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import logo from "@/assets/logo.png";

import type {
  Order,
  OrderItem,
} from "../types/order.types";

async function imageToDataUrl(
  src: string
): Promise<string> {
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    dateStyle: "medium",
  });
}

export async function generatePackingSlip(
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
    22,
    22
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("TNM JEWELS", 42, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(120);

  pdf.text(
    "PACKING SLIP",
    42,
    25
  );

  pdf.setDrawColor(220);
  pdf.line(15, 36, 195, 36);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(30);

  pdf.text(
    `Order No : ${order.order_number}`,
    15,
    46
  );

  pdf.text(
    `Order Date : ${formatDate(order.created_at)}`,
    15,
    53
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);

  pdf.text("SHIP TO", 15, 68);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let y = 75;

  pdf.text(
    order.shipping_full_name ||
      order.customer_name,
    15,
    y
  );

  y += 6;

  pdf.text(
    order.shipping_phone ||
      order.customer_phone,
    15,
    y
  );

  y += 6;

  if (order.shipping_address) {
    pdf.text(
      order.shipping_address,
      15,
      y
    );

    y += 6;
  }

  pdf.text(
    `${order.shipping_city ?? ""}, ${
      order.shipping_state ?? ""
    }`,
    15,
    y
  );

  y += 6;

  pdf.text(
    `${order.shipping_country ?? ""} ${
      order.shipping_pincode ?? ""
    }`,
    15,
    y
  );

  y += 12;

  autoTable(pdf, {
    startY: y,

    head: [["Product", "Quantity"]],

    body: items.map((item) => [
      `☐ ${item.product_name}`,
      item.quantity.toString(),
    ]),

    headStyles: {
      fillColor: [30, 30, 30],
      textColor: 255,
    },

    styles: {
      fontSize: 10,
      cellPadding: 4,
    },

    columnStyles: {
      1: {
        halign: "center",
        cellWidth: 30,
      },
    },
  });

  const finalY =
    (pdf as jsPDF & {
      lastAutoTable?: {
        finalY: number;
      };
    }).lastAutoTable?.finalY ?? y;

let currentY = finalY + 12;

// Total Items
const totalItems = items.reduce(
  (sum, item) => sum + item.quantity,
  0
);

pdf.setFont("helvetica", "bold");
pdf.setFontSize(11);

pdf.text(
  `Total Items : ${totalItems}`,
  15,
  currentY
);

currentY += 12;

// Packing Checklist
pdf.setFont("helvetica", "bold");
pdf.setFontSize(12);

pdf.text(
  "PACKING CHECKLIST",
  15,
  currentY
);

currentY += 8;

pdf.setFont("helvetica", "normal");
pdf.setFontSize(10);

const checklist = [
  "Product Quality Checked",
  "Anti-Tarnish Pouch Added",
  "Thank You Card Added",
  "Free Gift Added (If Eligible)",
  "Order Sealed Properly",
];

checklist.forEach((item) => {
  pdf.rect(15, currentY - 3.5, 4, 4);

  pdf.text(item, 23, currentY);

  currentY += 8;
});

currentY += 8;

// Divider
pdf.setDrawColor(220);
pdf.line(15, currentY, 195, currentY);

currentY += 10;

// Packed By / Checked By
pdf.setFont("helvetica", "bold");
pdf.setFontSize(10);

pdf.text("Packed By", 15, currentY);
pdf.text("Checked By", 80, currentY);
pdf.text("Packing Date", 150, currentY);

currentY += 15;

pdf.line(15, currentY, 55, currentY);
pdf.line(80, currentY, 120, currentY);
pdf.line(150, currentY, 195, currentY);

currentY += 15;

// Footer
pdf.setFont("helvetica", "normal");
pdf.setFontSize(9);
pdf.setTextColor(120);

pdf.text(
  "This packing slip is for warehouse use only.",
  105,
  currentY,
  {
    align: "center",
  }
);

pdf.save(
  `PackingSlip-${order.order_number}.pdf`
);
}