// routes/siteSettingRoute/bannerSettingRoute.js
const express = require("express");
const {
  getBannerSettings,
  updateBannerSettings,
} = require("../controllers/bannerSettingController");

const bannerSettingRouter = express.Router();

bannerSettingRouter.get("/", getBannerSettings);
bannerSettingRouter.put("/", updateBannerSettings);

module.exports = bannerSettingRouter;
