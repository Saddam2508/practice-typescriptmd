const SiteInfo = require("../../models/siteSettings/siteInfoModel");
const { uploadSingleBuffer } = require("../../config/cloudinary"); // helper import
// ✅ GET /site-info
const getSiteInfo = async (req, res) => {
  try {
    const settings = await SiteInfo.findOne();
    res.json({
      siteName: settings?.siteName || "",
      logo: settings?.logo || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch site info", error });
  }
};

// ✅ PUT /site-info
const updateSiteInfo = async (req, res) => {
  try {
    const { siteName } = req.body;
    let logoUrl = null;

    // ✅ যদি ফাইল আসে, Cloudinary তে আপলোড করো
    if (req.file) {
      const result = await uploadSingleBuffer(req.file.buffer, "site/logo");
      logoUrl = result.secure_url;
    }

    const updateData = { siteName };
    if (logoUrl) updateData.logo = logoUrl;

    // MongoDB update বা create (upsert)
    const updated = await SiteInfo.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json({
      siteName: updated.siteName,
      logo: updated.logo,
    });
  } catch (error) {
    console.error("Update SiteInfo Error:", error);
    res.status(500).json({ message: "Failed to update site info", error });
  }
};

// ✅ DELETE /site-info
const deleteSiteInfo = async (req, res) => {
  try {
    const updated = await SiteInfo.findOneAndUpdate(
      {},
      {
        siteName: "",
        logo: "",
      },
      { new: true }
    );
    res.json({ message: "Site info reset successfully", siteInfo: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete site info", error });
  }
};

module.exports = {
  getSiteInfo,
  updateSiteInfo,
  deleteSiteInfo,
};
