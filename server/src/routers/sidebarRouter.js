const express = require("express");
const {
  getSidebarConfig,
  createSidebarConfig,
  updateSidebarConfig,
  deleteSidebarConfig,
} = require("../controllers/sidebarController");

const sidebarRouter = express.Router();

sidebarRouter.get("/", getSidebarConfig);
sidebarRouter.post("/", createSidebarConfig);
sidebarRouter.put("/:id", updateSidebarConfig);
sidebarRouter.delete("/:id", deleteSidebarConfig);

module.exports = sidebarRouter;
