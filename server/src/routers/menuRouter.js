const express = require("express");
const menuRouter = express.Router();
const {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");

// সব মেনু
menuRouter.get("/", getMenus);

// নতুন মেনু তৈরি
menuRouter.post("/", createMenu);

// মেনু আপডেট
menuRouter.put("/:id", updateMenu);

// মেনু ডিলিট
menuRouter.delete("/:id", deleteMenu);

module.exports = menuRouter;
