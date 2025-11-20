const express = require("express");
const {
  getSiteInfo,
  updateSiteInfo,
  deleteSiteInfo,
} = require("../../controllers/siteSettingController/siteInfoController");
const { uploadLogoOrIcons } = require("../../middlewares/uploadFile");
const siteInfoRouter = express.Router();

siteInfoRouter.get("/", getSiteInfo);
siteInfoRouter.put("/", uploadLogoOrIcons.single("logo"), updateSiteInfo);
siteInfoRouter.delete("/", deleteSiteInfo);

module.exports = siteInfoRouter;
