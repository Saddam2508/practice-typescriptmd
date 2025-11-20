// routes/adminRoutes.js বা routes/orderRoutes.js

const express = require("express");

const { markOrderDelivered } = require("../controllers/markOrderDelivered");
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");

const OrderDeliveredRouter = express.Router();

// PUT /api/orders/:id/deliver
OrderDeliveredRouter.put(
  "/:id/deliver",
  isLoggedInAdmin,
  isAdmins,
  markOrderDelivered
);

module.exports = OrderDeliveredRouter;
