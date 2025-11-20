// controllers/siteSettingController/bannerSettingController.js
const BannerSettings = require("../models/BannerSettings");

const getBannerSettings = async (req, res) => {
  try {
    let settings = await BannerSettings.findOne();
    if (!settings) {
      settings = await BannerSettings.create({ slideInterval: 3000 });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Settings load failed" });
  }
};

const updateBannerSettings = async (req, res) => {
  try {
    const { slideInterval } = req.body;
    let settings = await BannerSettings.findOne();
    if (!settings) {
      settings = await BannerSettings.create({ slideInterval });
    } else {
      settings.slideInterval = slideInterval;
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};
module.exports = {
  getBannerSettings,
  updateBannerSettings,
};
