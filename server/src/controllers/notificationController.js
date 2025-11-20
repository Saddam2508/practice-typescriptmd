const Notification = require("../models/notificationModel");

// 🔸 Admin creates a notification
const createNotification = async (req, res) => {
  try {
    const { title, message, type, user, order } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      user: user || null,
      order: order || null,
    });

    const saved = await notification.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification", error });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all notifications" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// 🔸 Get notifications for a specific user (or public)
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || null;

    const notifications = await Notification.find({
      $or: [
        { user: null }, // public/general
        { user: userId },
      ],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};

// 🔸 Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification", error });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  deleteNotification,
  getUserNotifications,
  markAsRead,
};
