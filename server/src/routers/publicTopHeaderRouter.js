// routes/adminHeaderRoutes.js
const express = require("express");
const publicTopHeaderRouter = express.Router();
const {
  getPublicTopHeaderConfig,
  createPublicTopHeaderConfig,
  updatePublicTopHeaderConfig,
  deletePublicTopHeaderConfig,
} = require("../controllers/publicTopHeaderController");

// যদি আপনার কাছে অ্যাডমিন middleware থাকে, ধরছি সেটা isAdmin.js
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

// ================= Public Route =================
publicTopHeaderRouter.get("/", getPublicTopHeaderConfig); // Admin Header fetch (public)

// ================= Admin Routes =================
publicTopHeaderRouter.post(
  "/",
  isLoggedInAdmin,
  isAdmins,
  createPublicTopHeaderConfig
); // Create new admin header config
publicTopHeaderRouter.put(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  updatePublicTopHeaderConfig
); // Update admin header config by ID
publicTopHeaderRouter.delete(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  deletePublicTopHeaderConfig
); // Delete admin header config by ID

module.exports = publicTopHeaderRouter;
