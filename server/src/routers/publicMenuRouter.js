const express = require("express");
const publicMenuRouter = express.Router();
const {
  getPublicMenus,
  createPublicMenu,
  updatePublicMenu,
  deletePublicMenu,
} = require("../controllers/publicMenuController");

// সব মেনু
publicMenuRouter.get("/", getPublicMenus);

// নতুন মেনু তৈরি
publicMenuRouter.post("/", createPublicMenu);

// মেনু আপডেট
publicMenuRouter.put("/:id", updatePublicMenu);

// মেনু ডিলিট
publicMenuRouter.delete("/:id", deletePublicMenu);

module.exports = publicMenuRouter;
