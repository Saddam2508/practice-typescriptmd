const express = require("express");
const {
  getFooterInfo,
  updateFooterInfo,
  deleteFooterInfo,
} = require("../controllers/footerControllerPra");
const { socialIconUploader } = require("../middlewares/uploadFile");

const footerRouterPra = express.Router();

footerRouterPra.get("/", getFooterInfo);
footerRouterPra.put("/", socialIconUploader, updateFooterInfo);
footerRouterPra.delete("/", deleteFooterInfo);

module.exports = footerRouterPra;
