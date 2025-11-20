const FooterPra = require("../models/footerModelPra");
const { uploadSingleBuffer } = require("../config/cloudinary");

// ✅ GET /footer
const getFooterInfo = async (req, res) => {
  try {
    const settings = await FooterPra.findOne();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch footer info", error });
  }
};

// ✅ PUT /footer
const updateFooterInfo = async (req, res) => {
  try {
    const { text, slogan, socialLinks, sections, appLinks, paymentMethods } =
      req.body;

    // Parse stringified arrays from form-data
    const parsedSocialLinks = JSON.parse(socialLinks || "[]");
    const parsedSections = JSON.parse(sections || "[]");
    const parsedAppLinks = JSON.parse(appLinks || "[]");
    const parsedPaymentMethods = JSON.parse(paymentMethods || "[]");

    // Upload logo if exists
    let logoUrl;
    if (req.files?.logo?.[0]) {
      const uploadRes = await uploadSingleBuffer(
        req.files.logo[0].buffer,
        "footer/logo"
      );
      logoUrl = uploadRes.secure_url;
    }

    // Upload social icons if exists
    const processedSocialLinks = await Promise.all(
      parsedSocialLinks.map(async (link, i) => {
        const fileKey = `socialIconFile_${i}`;
        if (req.files && req.files[fileKey]) {
          const file = req.files[fileKey][0];
          const uploadRes = await uploadSingleBuffer(
            file.buffer,
            "footer/socialIcons"
          );
          return { ...link, iconUrl: uploadRes.secure_url };
        }
        return link;
      })
    );

    // Upload app link images if exists
    const processedAppLinks = await Promise.all(
      parsedAppLinks.map(async (link, i) => {
        const fileKey = `appLinkFile_${i}`;
        if (req.files && req.files[fileKey]) {
          const file = req.files[fileKey][0];
          const uploadRes = await uploadSingleBuffer(
            file.buffer,
            "footer/appLinks"
          );
          return { ...link, imageUrl: uploadRes.secure_url };
        }
        return link;
      })
    );

    // Upload payment method images if exists
    const processedPaymentMethods = await Promise.all(
      parsedPaymentMethods.map(async (pm, i) => {
        const fileKey = `paymentFile_${i}`;
        if (req.files && req.files[fileKey]) {
          const file = req.files[fileKey][0];
          const uploadRes = await uploadSingleBuffer(
            file.buffer,
            "footer/paymentMethods"
          );
          return { ...pm, imageUrl: uploadRes.secure_url };
        } else if (pm.imageUrl?.startsWith("blob:")) {
          // Blob URL থাকলে remove করুন বা throw error
          return { ...pm, imageUrl: "" };
        }
        return pm;
      })
    );

    // Update or Insert Footer
    const updated = await FooterPra.findOneAndUpdate(
      {},
      {
        text,
        slogan,
        logoUrl,
        socialLinks: processedSocialLinks,
        sections: parsedSections,
        appLinks: processedAppLinks,
        paymentMethods: processedPaymentMethods,
      },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Footer update failed", error });
  }
};

// ✅ DELETE /footer
const deleteFooterInfo = async (req, res) => {
  try {
    const updated = await FooterPra.findOneAndUpdate(
      {},
      {
        text: "",
        slogan: "",
        logoUrl: "",
        socialLinks: [],
        sections: [],
        appLinks: [],
        paymentMethods: [],
      },
      { new: true }
    );

    res.json({
      message: "Footer info reset successfully",
      footer: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete footer info", error });
  }
};

module.exports = {
  getFooterInfo,
  updateFooterInfo,
  deleteFooterInfo,
};
