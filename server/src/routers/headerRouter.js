// routes/headerRoutes.js
const express = require("express");
const headerRouter = express.Router();
const {
  getHeaderConfig,
  createHeaderConfig,
  updateHeaderConfig,
  deleteHeaderConfig,
} = require("../controllers/headerController");

// যদি আপনার কাছে অ্যাডমিন middleware থাকে, ধরছি সেটা isAdmin.js
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

// ================= Public Route =================
headerRouter.get("/", getHeaderConfig); // Header fetch (public)

// ================= Admin Routes =================
headerRouter.post("/", isLoggedInAdmin, isAdmins, createHeaderConfig); // Create new header config
headerRouter.put("/:id", isLoggedInAdmin, isAdmins, updateHeaderConfig); // Update header config by ID
headerRouter.delete("/:id", isLoggedInAdmin, isAdmins, deleteHeaderConfig); // Delete header config by ID

module.exports = headerRouter;
