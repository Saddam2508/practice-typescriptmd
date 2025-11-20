// routes/adminHeaderRoutes.js
const express = require("express");
const publicSubHeaderPraRouter = express.Router();
const {
  getPublicSubHeaderConfig,
  createPublicSubHeaderConfig,
  updatePublicSubHeaderConfig,
  deletePublicSubHeaderConfig,
} = require("../controllers/publicSubHeaderControllerPra");

// যদি আপনার কাছে অ্যাডমিন middleware থাকে, ধরছি সেটা isAdmin.js
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

// ================= Public Route =================
publicSubHeaderPraRouter.get("/", getPublicSubHeaderConfig); // Admin Header fetch (public)

// ================= Admin Routes =================
publicSubHeaderPraRouter.post(
  "/",
  isLoggedInAdmin,
  isAdmins,
  createPublicSubHeaderConfig
); // Create new admin header config
publicSubHeaderPraRouter.put(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  updatePublicSubHeaderConfig
); // Update admin header config by ID
publicSubHeaderPraRouter.delete(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  deletePublicSubHeaderConfig
); // Delete admin header config by ID

module.exports = publicSubHeaderPraRouter;
