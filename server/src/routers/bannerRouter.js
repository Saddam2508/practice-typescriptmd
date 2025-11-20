const express = require("express");
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const { uploadBanner } = require("../middlewares/uploadFile");
const bannerRouter = express.Router();

bannerRouter.post("/", uploadBanner.single("banner"), createBanner);
bannerRouter.get("/", getBanners);
bannerRouter.put("/:id", uploadBanner.single("banner"), updateBanner);
bannerRouter.delete("/:id", deleteBanner);

module.exports = bannerRouter;
