const express = require("express");
const {
  getFooterInfo,
  updateFooterInfo,
  deleteFooterInfo,
} = require("../controllers/footerController");
const { socialIconUploader } = require("../middlewares/uploadFile");

const footerRouter = express.Router();

footerRouter.get("/", getFooterInfo);
footerRouter.put("/", socialIconUploader, updateFooterInfo);
footerRouter.delete("/", deleteFooterInfo);

module.exports = footerRouter;
