const mongoose = require("mongoose");

const voucherTemplateSchema = new mongoose.Schema(
  {
    companyName: String,
    address: String,
    website: String,
    email: String,
    phone: String,
    signatureUrl: String,
    logoUrl: String, // লোগোর URL
    qrCodeUrl: String, // QR কোডের URL এখানে যোগ করা হলো
    sealText: { type: String, default: "PAID" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "VoucherTemplateSettings",
  voucherTemplateSchema
);
