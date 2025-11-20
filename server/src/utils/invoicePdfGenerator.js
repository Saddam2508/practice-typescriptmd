const PDFDocument = require("pdfkit");
const axios = require("axios");
const { uploadRawBuffer } = require("../config/cloudinary");
const QRCode = require("qrcode");

async function fetchImageBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch {
    return null;
  }
}

const generateInvoicePdf = async ({ order, setting }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);
        const result = await uploadRawBuffer(
          pdfBuffer,
          "invoices",
          `invoice-${order._id}`
        );
        resolve(result.secure_url);
      });

      // ===== Header =====
      if (setting.logoUrl) {
        const logoBuffer = await fetchImageBuffer(setting.logoUrl);
        if (logoBuffer) {
          doc.image(logoBuffer, 50, 45, { width: 100 });
        }
      }

      doc
        .fontSize(20)
        .text(setting.companyName || "Your Company", 200, 50, {
          align: "right",
        })
        .fontSize(10)
        .text(setting.address || "", { align: "right" })
        .text(`Email: ${setting.email || ""}`, { align: "right" })
        .text(`Phone: ${setting.phone || ""}`, { align: "right" })
        .text(`Website: ${setting.website || ""}`, { align: "right" })
        .moveDown(4);

      // ===== Invoice Title =====
      doc.fontSize(18).text("INVOICE", { align: "center" }).moveDown(2);

      // ===== Customer Info =====
      // ===== Customer Info (Left Aligned) =====
      const leftX = 50;
      let currentY = doc.y; // বর্তমান y পজিশন স্মরণ রাখা

      doc
        .fontSize(12)
        .text(`Invoice #: ${order._id}`, leftX, currentY)
        .text(
          `Date: ${new Date(
            order.orderedAt || order.createdAt
          ).toLocaleDateString()}`,
          leftX
        )
        .text(`Customer: ${order.user?.name || "N/A"}`, leftX)
        .text(`Address: ${order?.shippingAddress || "N/A"}`, leftX)
        .text(`Email: ${order.user?.email || "N/A"}`, leftX)
        .moveDown();

      // ===== Table Header =====
      const tableTop = doc.y + 10;
      const itemX = 50;
      const qtyX = 300;
      const priceX = 370;
      const totalX = 460;

      doc.font("Helvetica-Bold").fontSize(12);
      doc.text("Product", itemX, tableTop);
      doc.text("Qty", qtyX, tableTop, { width: 50, align: "right" });
      doc.text("Price", priceX, tableTop, { width: 60, align: "right" });
      doc.text("Total", totalX, tableTop, { width: 60, align: "right" });

      doc
        .moveTo(itemX, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // ===== Table Rows =====
      doc.font("Helvetica").fontSize(11);
      let y = tableTop + 25;
      let itemsPrice = 0;

      if (Array.isArray(order.items) && order.items.length > 0) {
        order.items.forEach((item) => {
          const total = item.quantity * item.price;
          itemsPrice += total;

          doc.text(item.name, itemX, y);
          doc.text(item.quantity.toString(), qtyX, y, {
            width: 50,
            align: "right",
          });
          doc.text(`Tk ${item.price}`, priceX, y, {
            width: 60,
            align: "right",
          });
          doc.text(`Tk ${total}`, totalX, y, {
            width: 60,
            align: "right",
          });

          y += 20;
        });
      } else {
        doc
          .fillColor("red")
          .text("⚠ No order items found", itemX, y)
          .fillColor("black");
        y += 20;
      }

      // ===== Summary Section (Fully Left-Aligned) =====
      const shipping = order.shippingPrice || 0;
      const tax = order.taxPrice || 0;
      const grandTotal = order.totalAmount || itemsPrice + shipping + tax;

      y += 30;
      doc.font("Helvetica-Bold").fontSize(12);

      // নতুন পজিশন
      const labelX = 390;
      const colonX = labelX + 70; // ঠিক কোলনের জন্য জায়গা
      const valueX = colonX + 10; // কোলনের পরের Tk এর জন্য

      // Helper ফাংশন
      function drawSummaryLine(label, value, yPos) {
        doc.text(label, labelX, yPos);
        doc.text(":", colonX, yPos);
        doc.text(`Tk ${value}`, valueX, yPos); // কোনো align:right নাই, বামে বসবে
      }

      drawSummaryLine("Subtotal", itemsPrice, y);
      y += 20;
      drawSummaryLine("Shipping", shipping, y);
      y += 20;
      drawSummaryLine("Tax", tax, y);
      y += 20;
      drawSummaryLine("Total", grandTotal, y);

      // ===== Signature =====
      if (setting.signatureUrl) {
        const signBuffer = await fetchImageBuffer(setting.signatureUrl);
        if (signBuffer) {
          doc.image(signBuffer, 400, y + 30, { width: 100 });
        }
      }

      // ===== QR Code =====
      const qrText = `Order ID: ${order._id}\nName: ${
        order.user?.name || "N/A"
      }\nTotal: Tk ${grandTotal}`;
      const qrImageBuffer = await QRCode.toBuffer(qrText);
      doc.image(qrImageBuffer, 50, y + 40, { width: 100 });

      doc.end();
    } catch (error) {
      console.error("❌ PDF Generation Error:", error);
      reject(error);
    }
  });
};

module.exports = generateInvoicePdf;
