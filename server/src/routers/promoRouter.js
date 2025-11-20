const express = require("express");
const {
  getPromos,
  getPromoById,
  createPromo,
  updatePromo,
  deletePromo,
} = require("../controllers/promoController");

const promoRouter = express.Router();

// CRUD routes
promoRouter.get("/", getPromos); // Read all
promoRouter.get("/:id", getPromoById); // Read single
promoRouter.post("/", createPromo); // Create
promoRouter.put("/:id", updatePromo); // Update
promoRouter.delete("/:id", deletePromo); // Delete

module.exports = promoRouter;
