const mongoose = require("mongoose");

const siteInfoSchema = new mongoose.Schema({
  siteName: String,
  logo: String,
});

module.exports = mongoose.model("SiteInfo", siteInfoSchema);
