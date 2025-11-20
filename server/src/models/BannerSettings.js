// models/BannerSettings.js
const mongoose = require("mongoose");

const bannerSettingsSchema = new mongoose.Schema(
  {
    slideInterval: {
      type: Number,
      default: 3000, // default ৩ সেকেন্ড
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BannerSettings", bannerSettingsSchema);
