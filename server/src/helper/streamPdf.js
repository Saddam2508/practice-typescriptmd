const axios = require("axios");

const streamPdf = async (req, res, pdfUrl, fileName) => {
  try {
    if (!pdfUrl) {
      return res.status(404).send("PDF URL not provided");
    }

    const response = await axios.get(pdfUrl, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}.pdf"`);

    response.data.pipe(res);
  } catch (error) {
    console.error("Error streaming PDF:", error);
    res.status(500).send("Error fetching PDF");
  }
};

module.exports = { streamPdf };
