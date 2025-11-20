const express = require("express");
const { uploadProductImage } = require("../middlewares/uploadFile");

const runValidation = require("../validators");

const {
  handleCreateProduct,
  handleGetProducts,
  handleGetSingleProduct,
  handleDeleteProduct,
  handleUpdateProduct,
  handleGetProductsByCategory,
  handleGetProductsByCategoryWise,
  rateProduct,
  handleGetBestSellingProducts,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

const productRouter = express.Router();

productRouter.post(
  "/",
  isLoggedInAdmin,
  isAdmins,
  uploadProductImage.single("image"),
  validateProduct,
  runValidation,
  handleCreateProduct
);
productRouter.get("/", handleGetProducts);
productRouter.get("/bestselling", handleGetBestSellingProducts);
productRouter.get("/category-wise", handleGetProductsByCategoryWise);
productRouter.get("/:slug", handleGetSingleProduct);
productRouter.get("/category/:slug", handleGetProductsByCategory);

productRouter.delete("/:slug", isLoggedInAdmin, isAdmins, handleDeleteProduct);
productRouter.put(
  "/:slug",
  isLoggedInAdmin,
  isAdmins,
  uploadProductImage.single("image"),
  handleUpdateProduct
);
productRouter.post("/:slug/rate", rateProduct);

module.exports = productRouter;
