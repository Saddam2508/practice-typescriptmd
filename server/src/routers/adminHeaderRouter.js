// routes/adminHeaderRoutes.js
const express = require("express");
const adminHeaderRouter = express.Router();
const {
  getAdminHeaderConfig,
  createAdminHeaderConfig,
  updateAdminHeaderConfig,
  deleteAdminHeaderConfig,
} = require("../controllers/adminHeaderController");

// যদি আপনার কাছে অ্যাডমিন middleware থাকে, ধরছি সেটা isAdmin.js
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

// ================= Public Route =================
adminHeaderRouter.get("/", getAdminHeaderConfig); // Admin Header fetch (public)

// ================= Admin Routes =================
adminHeaderRouter.post("/", isLoggedInAdmin, isAdmins, createAdminHeaderConfig); // Create new admin header config
adminHeaderRouter.put(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  updateAdminHeaderConfig
); // Update admin header config by ID
adminHeaderRouter.delete(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  deleteAdminHeaderConfig
); // Delete admin header config by ID

module.exports = adminHeaderRouter;
