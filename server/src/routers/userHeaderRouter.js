// routes/headerRoutes.js
const express = require("express");
const userHeaderRouter = express.Router();
const {
  getUserHeaderConfig,
  createUserHeaderConfig,
  updateUserHeaderConfig,
  deleteUserHeaderConfig,
} = require("../controllers/userHeaderController");

// যদি আপনার কাছে অ্যাডমিন middleware থাকে, ধরছি সেটা isAdmin.js
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

// ================= Public Route =================
userHeaderRouter.get("/", getUserHeaderConfig); // Header fetch (public)

// ================= Admin Routes =================
userHeaderRouter.post("/", isLoggedInAdmin, isAdmins, createUserHeaderConfig); // Create new header config
userHeaderRouter.put("/:id", isLoggedInAdmin, isAdmins, updateUserHeaderConfig); // Update header config by ID
userHeaderRouter.delete(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  deleteUserHeaderConfig
); // Delete header config by ID

module.exports = userHeaderRouter;
