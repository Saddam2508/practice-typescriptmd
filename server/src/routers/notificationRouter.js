const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  getAllNotifications,
  deleteNotification,
} = require("../controllers/notificationController");
const notificationRouter = express.Router();

// 🔒 (middleware check can be added for admin/user auth)
const { isLoggedInAdmin, isAdmins } = require("../middlewares/admin");
const { isLoggedIn } = require("../middlewares/auth");
// Admin creates a notification
notificationRouter.post("/", isLoggedInAdmin, isAdmins, createNotification);

notificationRouter.get("/all", isLoggedInAdmin, isAdmins, getAllNotifications);
// Logged-in user fetches own/public notifications
notificationRouter.get("/", isLoggedIn, getUserNotifications);

// Mark a notification as read
notificationRouter.put("/:id/read", isLoggedIn, markAsRead);
notificationRouter.delete(
  "/:id",
  isLoggedInAdmin,
  isAdmins,
  deleteNotification
);

module.exports = notificationRouter;
