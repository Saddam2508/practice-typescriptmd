const axios = require("axios");

/**
 * Common PDF download helper
 * @param {Object} options
 * @param {Model} options.model - Mongoose model (যেমন Voucher)
 * @param {Object} options.query - model.findOne এর জন্য query (যেমন { code: 'ABC123' })
 * @param {string} options.urlField - ডাটাবেজে পিডিএফ URL স্টোর করা ফিল্ড নাম (যেমন 'pdfUrl')
 * @param {string} options.filenamePrefix - ডাউনলোড ফাইলের নামের প্রিফিক্স (যেমন 'voucher-')
 */
const pdfDownloadHelper = async (
  { model, query, urlField, filenamePrefix },
  req,
  res
) => {
  try {
    const doc = await model.findOne(query);
    if (!doc || !doc[urlField]) {
      return res.status(404).send("PDF not found");
    }

    const fileUrl = doc[urlField];
    const response = await axios.get(fileUrl, { responseType: "stream" });

    // Extract file name from URL or use prefix + identifier
    const identifier = query.code || query._id || "file";
    const filename = `${filenamePrefix}${identifier}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    response.data.pipe(res);
  } catch (error) {
    console.error("PDF Download Error:", error);
    res.status(500).send("Error downloading PDF");
  }
};

module.exports = pdfDownloadHelper;
