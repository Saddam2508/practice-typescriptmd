// routes/adminHeaderRoutes.js
const express = require("express");
const publicSubHeaderRouter = express.Router();
const {
  getPublicSubHeaderConfig,
  createPublicSubHeaderConfig,
  updatePublicSubHeaderConfig,
  deletePublicSubHeaderConfig,
} = require("../controllers/publicSubHeaderController");

// যদি আপনার কাছে অ্যাডমিন middleware থাকে, ধরছি সেটা isAdmin.js
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

// ================= Public Route =================
publicSubHeaderRouter.get("/", getPublicSubHeaderConfig); // Admin Header fetch (public)

// ================= Admin Routes =================
publicSubHeaderRouter.post(
  "/",
  isLoggedInAdmin,
  isAdmins,
  createPublicSubHeaderConfig
); // Create new admin header config
publicSubHeaderRouter.put(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  updatePublicSubHeaderConfig
); // Update admin header config by ID
publicSubHeaderRouter.delete(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  deletePublicSubHeaderConfig
); // Delete admin header config by ID

module.exports = publicSubHeaderRouter;
