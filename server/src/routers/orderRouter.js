const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");
const {
  handleCreateOrder,
  handlegetAllOrders,
  handleupdateOrderStatus,
  handledeleteOrder,
  handleGetUserOrders,
  streamInvoicePdf,
  downloadInvoicePdf,
} = require("../controllers/orderController");

const orderRouter = express.Router();

// ✅ ইউজার অর্ডার করে
orderRouter.post("/", isLoggedIn, handleCreateOrder);

// ✅ ইউজার নিজের অর্ডার দেখতে পারে
orderRouter.get("/my-orders", isLoggedIn, handleGetUserOrders);

// ✅ অ্যাডমিন সব অর্ডার দেখতে পারে
orderRouter.get("/", isLoggedInAdmin, isAdmins, handlegetAllOrders);

// ✅ ✅ ✅ ইউজার বা অ্যাডমিন উভয়েই স্ট্যাটাস আপডেট করতে পারবে
orderRouter.put("/:id/status", handleupdateOrderStatus);

// ✅ অ্যাডমিন অর্ডার ডিলিট করতে পারে
orderRouter.delete("/:id", isLoggedInAdmin, isAdmins, handledeleteOrder);

orderRouter.get(
  "/invoice/pdf-view/:orderId",
  isLoggedInAdmin,
  streamInvoicePdf
);
orderRouter.get(
  "/invoice/pdf-download/:orderId",
  isLoggedInAdmin,
  downloadInvoicePdf
);

orderRouter.get(
  "/user/invoice/pdf-view/:orderId",
  isLoggedIn,
  streamInvoicePdf
);
orderRouter.get(
  "/user/invoice/pdf-download/:orderId",
  isLoggedIn,
  downloadInvoicePdf
);

module.exports = orderRouter;
