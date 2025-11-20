const voucherPdfGenerator = require("./voucherPdfGenerator");
const SiteSettings = require("../models/siteSettingsModel");

const generateVoucherPDF = async ({ order, user, voucher }) => {
  try {
    // 🔍 Site settings থেকে লোগো ও কারেন্সি
    const siteInfo = await SiteSettings.findOne();
    const logoUrl = siteInfo?.logo || "https://via.placeholder.com/120";
    const currency = siteInfo?.currency || "৳";

    // 🧾 PDF বানাও
    const pdfUrl = await voucherPdfGenerator(voucher, user, {
      logoUrl,
      currency,
      order, // 👉 অতিরিক্তভাবে order দিলে products ডাইনামিক হবে
    });

    return pdfUrl;
  } catch (err) {
    console.error("❌ Error generating voucher PDF:", err);
    throw new Error("Failed to generate PDF");
  }
};

module.exports = generateVoucherPDF;
