// controllers/headerController.js
const UserHeaderConfig = require("../models/userHeaderConfig");

// ================= Get Header Config =================
const getUserHeaderConfig = async (req, res) => {
  try {
    const config = await UserHeaderConfig.findOne().sort({ createdAt: -1 });
    if (!config)
      return res.status(404).json({ message: "No header config found" });
    res.json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Create Header Config =================
const createUserHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = new UserHeaderConfig(data);
    await config.save();
    res.status(201).json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Update Header Config =================
const updateUserHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = await UserHeaderConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ message: "Header config not found" });
    config.set(data);
    await config.save();
    res.json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Delete Header Config =================
const deleteUserHeaderConfig = async (req, res) => {
  try {
    const config = await UserHeaderConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ message: "Header config not found" });
    await config.remove();
    res.json({ message: "Header config deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserHeaderConfig,
  createUserHeaderConfig,
  updateUserHeaderConfig,
  deleteUserHeaderConfig,
};
