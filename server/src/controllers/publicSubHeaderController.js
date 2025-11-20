// controllers/adminHeaderController.js
const PublicSubHeaderConfig = require("../models/publicSubHeaderConfig");

// ================= Get Admin Header Config =================
const getPublicSubHeaderConfig = async (req, res) => {
  try {
    const config = await PublicSubHeaderConfig.findOne().sort({
      createdAt: -1,
    });
    if (!config)
      return res.status(404).json({ message: "No admin header config found" });
    res.json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Create Admin Header Config =================
const createPublicSubHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = new PublicSubHeaderConfig(data);
    await config.save();
    res.status(201).json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Update Admin Header Config =================
const updatePublicSubHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = await PublicSubHeaderConfig.findById(req.params.id);
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
const deletePublicSubHeaderConfig = async (req, res) => {
  try {
    const config = await PublicSubHeaderConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ message: "Admin header config not found" });
    await config.remove();
    res.json({ message: "Admin header config deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPublicSubHeaderConfig,
  createPublicSubHeaderConfig,
  updatePublicSubHeaderConfig,
  deletePublicSubHeaderConfig,
};
