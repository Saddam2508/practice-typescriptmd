const express = require("express");
const productImageRouter = express.Router();

const {
  handleAddImage,
  handleDeleteImage,
  handleGetImagesByProduct,
} = require("../controllers/productImageController");
const { uploadProductImageCloud } = require("../middlewares/uploadFile");

// Add image for product gallery
productImageRouter.put(
  "/:productId",
  uploadProductImageCloud.array("images", 10),
  handleAddImage
);

// Delete image by imageId
productImageRouter.delete("/:imageId", handleDeleteImage);

// Get all images for product
productImageRouter.get("/:productId", handleGetImagesByProduct);

module.exports = productImageRouter;
