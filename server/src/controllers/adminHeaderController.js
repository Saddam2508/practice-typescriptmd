// controllers/adminHeaderController.js
const AdminHeaderConfig = require("../models/adminHeaderConfig");

// ================= Get Admin Header Config =================
const getAdminHeaderConfig = async (req, res) => {
  try {
    const config = await AdminHeaderConfig.findOne().sort({ createdAt: -1 });
    if (!config)
      return res.status(404).json({ message: "No admin header config found" });
    res.json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Create Admin Header Config =================
const createAdminHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = new AdminHeaderConfig(data);
    await config.save();
    res.status(201).json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Update Admin Header Config =================
const updateAdminHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = await AdminHeaderConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ message: "Admin header config not found" });
    config.set(data);
    await config.save();
    res.json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Delete Admin Header Config =================
const deleteAdminHeaderConfig = async (req, res) => {
  try {
    const config = await AdminHeaderConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ message: "Admin header config not found" });
    await config.remove();
    res.json({ message: "Admin header config deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAdminHeaderConfig,
  createAdminHeaderConfig,
  updateAdminHeaderConfig,
  deleteAdminHeaderConfig,
};
