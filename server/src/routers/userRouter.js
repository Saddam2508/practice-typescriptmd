const express = require("express");
const multer = require("multer");

const upload = multer();

const {
  handleGetUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleUpdateUserById,
  handleManagerUserStatusById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
  handleProcessRegister,
  handleActivateAccount,
  handleGetMyProfile,
  handleUpdateUserProfile,
} = require("../controllers/userController");

const { uploadUserImageMemory } = require("../middlewares/uploadFile");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

const userRouter = express.Router();

// ✅ Register & Activate
userRouter.post(
  "/process-register",
  isLoggedOut,
  uploadUserImageMemory.single("image"),
  validateUserRegistration,
  runValidation,
  handleProcessRegister
);
userRouter.post("/verify", isLoggedOut, handleActivateAccount);

userRouter.patch(
  "/update-profile",
  isLoggedIn,
  uploadUserImageMemory.single("image"), // for image upload if needed
  handleUpdateUserProfile
);

// ✅ Password actions
userRouter.post(
  "/forget-password",
  upload.none(),
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword
);
userRouter.put(
  "/reset-password/:token",
  upload.none(),
  validateUserResetPassword,
  runValidation,
  handleResetPassword
);
userRouter.put(
  "/update-password/:id",
  isLoggedIn,
  upload.none(),
  validateUserPasswordUpdate,
  runValidation,
  handleUpdatePassword
);

// ✅ User management by admin
userRouter.put(
  "/manage-user/:id",
  isLoggedInAdmin,
  isAdmins,
  handleManagerUserStatusById
);

// ✅ Get all users (admin only)
userRouter.get("/", isLoggedInAdmin, isAdmins, handleGetUsers);
userRouter.get("/me", isLoggedIn, handleGetMyProfile);

// ✅ CRUD user by ID (Keep these at bottom)
userRouter.get("/:id", isLoggedInAdmin, handleGetUserById);
userRouter.put(
  "/:id",
  uploadUserImageMemory.single("image"),
  isLoggedInAdmin,
  handleUpdateUserById
);
userRouter.delete("/:id", isLoggedInAdmin, handleDeleteUserById);

module.exports = userRouter;
