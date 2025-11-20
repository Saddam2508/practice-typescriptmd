const express = require("express");

const runValidation = require("../validators");
const {
  handleCreateCategory,
  handleGetCategory,
  handleGetSingleCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");
const { uploadCategoryImage } = require("../middlewares/uploadFile");

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  isLoggedInAdmin,
  isAdmins,
  uploadCategoryImage.single("image"),
  validateCategory,
  runValidation,
  handleCreateCategory
);
categoryRouter.get("/", handleGetCategory);
categoryRouter.get("/:slug", handleGetSingleCategory);
categoryRouter.put(
  "/:slug",
  isLoggedInAdmin,
  isAdmins,
  uploadCategoryImage.single("image"), // প্রথমে multer handle
  validateCategory, // তারপর validation
  runValidation,
  handleUpdateCategory
);

categoryRouter.delete(
  "/:slug",
  isLoggedInAdmin,
  isAdmins,
  handleDeleteCategory
);

module.exports = categoryRouter;
