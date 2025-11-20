const express = require("express");
const runValidation = require("../validators");
const { isLoggedOutAdmin, isLoggedInAdmin } = require("../middlewares/admin");
const { uploadAdminImageMemory } = require("../middlewares/uploadFile");
const { validateUserLogin } = require("../validators/auth");
const {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminRefreshToken,
  handleAdminProtectedRoute,
  handleGetAdminProfile, // ✅ Added
  handleUpdateAdminProfile, // ✅ Added
} = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOutAdmin,
  handleAdminLogin
);
adminRouter.post("/logout", isLoggedInAdmin, handleAdminLogout);
adminRouter.post("/refresh-token", handleAdminRefreshToken);
adminRouter.get("/protected", handleAdminProtectedRoute);

// ✅ New routes
adminRouter.get("/profile", isLoggedInAdmin, handleGetAdminProfile);
adminRouter.put(
  "/profile",
  isLoggedInAdmin,
  uploadAdminImageMemory.single("image"),
  handleUpdateAdminProfile
);

module.exports = adminRouter;
