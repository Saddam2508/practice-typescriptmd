const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
// node-fetch import for CommonJS
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const Settings = require("../models/voucherTemplateSettings");
const { uploadRawBuffer } = require("../config/cloudinary");
const Order = require("../models/orderModel");

const voucherPdfGenerator = async (orderId, user) => {
  const settings = await Settings.findOne();
  const order = await Order.findById(orderId).populate("items.product");

  if (!order) throw new Error("Order not found");

  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));
  const pdfPromise = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });

  const currency = settings.currencySymbol || "Tk";
  const taxRate = 0.05;

  // Logo - ক্লাউডিনারী থেকে ইমেজ ডাউনলোড করে Buffer তৈরি করে দেখাবে
  if (settings.logoUrl) {
    try {
      const response = await fetch(settings.logoUrl);
      if (!response.ok) throw new Error("Failed to fetch logo image");

      const logoBuffer = await response.buffer();
      doc.image(logoBuffer, 50, 50, { width: 80 });
    } catch (e) {
      console.error("Logo load failed:", e.message);
    }
  }

  // Header Text (Company Info)
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(settings.companyName || "Your Company", {
      align: "center",
    });

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(settings.address || "", { align: "center" })
    .text(settings.email || "", { align: "center" })
    .text(settings.phone || "", { align: "center" })
    .text(settings.website || "", { align: "center" });

  doc.moveDown(2);

  // Order Info
  const startX = 50;
  let startY = doc.y;

  doc.fontSize(11);

  // Draw "To:" label
  doc.font("Helvetica-Bold").text("To:", startX, startY);

  // Now draw the name a bit to the right (e.g., +30px)
  const nameX = startX + 30;
  const nameText = user?.name || user?.email || "";
  doc.font("Helvetica").text(nameText, nameX, startY);

  startY = doc.y + 5;

  doc
    .font("Helvetica-Bold")
    .text("Address:", nameX, startY, { continued: true })
    .font("Helvetica")
    .text(" " + (user.address || "No address provided"));

  // Move down for next lines
  startY = doc.y + 5;

  // Align all other lines under nameText
  doc
    .font("Helvetica-Bold")
    .text("Order ID:", nameX, startY, { continued: true })
    .font("Helvetica")
    .text(" " + order._id);

  startY = doc.y + 5;

  doc
    .font("Helvetica-Bold")
    .text("Payment Method:", nameX, startY, { continued: true })
    .font("Helvetica")
    .text(" " + order.paymentMethod);

  startY = doc.y + 5;

  doc
    .font("Helvetica-Bold")
    .text("Order Date:", nameX, startY, { continued: true })
    .font("Helvetica")
    .text(" " + new Date(order.orderedAt).toLocaleDateString());

  doc.moveDown(2);

  // Table Header
  const tableTop = doc.y;
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("Product Name", 50, tableTop)
    .text("Qty", 280, tableTop, { width: 50, align: "center" })
    .text("Price", 350, tableTop, { width: 70, align: "right" })
    .text("Subtotal", 440, tableTop, { width: 90, align: "right" });

  // Draw line below header
  doc
    .moveTo(50, tableTop + 20)
    .lineTo(530, tableTop + 20)
    .stroke();

  doc.font("Helvetica").fontSize(10);

  let positionY = tableTop + 25;
  let total = 0;

  // Table Rows
  order.items.forEach((item) => {
    const name = item.product?.name || item.name || "Unnamed";
    const price =
      typeof item.product?.price === "number"
        ? item.product.price
        : typeof item.price === "number"
        ? item.price
        : 0;
    const quantity = item.quantity || 0;
    const subtotal = price * quantity;
    total += subtotal;

    doc
      .text(name, 50, positionY)
      .text(quantity.toString(), 280, positionY, { width: 50, align: "center" })
      .text(`${currency}${price.toFixed(2)}`, 350, positionY, {
        width: 70,
        align: "right",
      })
      .text(`${currency}${subtotal.toFixed(2)}`, 440, positionY, {
        width: 90,
        align: "right",
      });

    positionY += 20;
  });

  // Calculate VAT, Discount, Grand Total
  const vat = total * taxRate;
  const discount = 0;
  const grandTotal = total + vat - discount;

  // Totals Section Start a bit below last table row
  positionY += 20;

  const labelX = 350;
  const amountX = 461;
  const rowGap = 18;

  // Total
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Total:", labelX, positionY, { width: 100, align: "right" })
    .text(`${currency}${total.toFixed(2)}`, amountX, positionY, {
      width: 70,
      align: "right",
    });

  positionY += rowGap;

  // VAT
  doc
    .font("Helvetica")
    .text(`VAT (${(taxRate * 100).toFixed(0)}%)`, labelX, positionY, {
      width: 100,
      align: "right",
    })
    .text(`${currency}${vat.toFixed(2)}`, amountX, positionY, {
      width: 70,
      align: "right",
    });

  positionY += rowGap;

  // Discount
  doc
    .text("Discount", labelX, positionY, { width: 100, align: "right" })
    .text(`- ${currency}${discount.toFixed(2)}`, amountX, positionY, {
      width: 70,
      align: "right",
    });

  positionY += rowGap;

  // Grand Total
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Grand Total:", labelX, positionY, { width: 100, align: "right" })
    .text(`${currency}${grandTotal.toFixed(2)}`, amountX, positionY, {
      width: 70,
      align: "right",
    });

  // PAID Stamp (diagonal, semi-transparent red)
  doc.save();
  doc
    .font("Helvetica-Bold")
    .fontSize(50)
    .fillColor("red")
    .opacity(0.15)
    .rotate(45, { origin: [300, 400] })
    .text(settings.sealText || "PAID", 150, 350, { align: "center" });
  doc.restore();

  // Footer (bottom of page)
  const bottomMargin = 70;
  const footerY = doc.page.height - bottomMargin;

  // QR কোডের জন্য লিংক (settings থেকে)
  const qrLink = settings.qrCodeUrl || "https://your-default-url.com";

  // QR কোড জেনারেট করে Buffer এ রূপান্তর
  const qrBuffer = await QRCode.toBuffer(qrLink, {
    type: "png",
    margin: 1,
    width: 100, // QR কোডের সাইজ (পিক্সেল)
  });

  // QR কোড PDF এ বসানো
  const qrWidth = 100;
  const qrHeight = 100;

  // ডানপাশ থেকে 50px, পেজের নিচ থেকে 70px মার্জিন রেখে এবং উপরে 20px স্পেস দিয়ে বসানো
  const qrX = doc.page.width - 50 - qrWidth; // ডানপাশ থেকে 50px দূরে
  const qrY = doc.page.height - 70 - qrHeight - 40; // নিচ থেকে উপরে উঠানো

  doc.image(qrBuffer, qrX, qrY, { width: qrWidth, height: qrHeight });

  // Footer টেক্সট নিচে রাখলাম
  doc.fontSize(10).fillColor("black");
  doc.text("Prepared By: ____________________", 50, footerY);
  doc.text(
    "Certified By: ____________________",
    doc.page.width - 250,
    footerY,
    { align: "right", width: 200 }
  );

  doc.end();

  const pdfBuffer = await pdfPromise;

  const fileName = `order-${order._id}.pdf`;
  const fileNameWithoutExt = fileName.replace(/\.pdf$/i, "");

  const result = await uploadRawBuffer(pdfBuffer, "orders", fileNameWithoutExt);

  return result.secure_url;
};

module.exports = voucherPdfGenerator;
