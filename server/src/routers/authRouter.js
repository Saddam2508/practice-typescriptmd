// authRouter.js
const express = require("express");
const runValidation = require("../validators");
const { uploadUserImage } = require("../middlewares/uploadFile");
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
  handleGoogleOAuth,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/auth");

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleLogin
);
authRouter.post(
  "/google-login",
  uploadUserImage.single("image"), // optional: include only if you expect image file
  handleGoogleOAuth
);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.post("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtectedRoute);

module.exports = authRouter;
