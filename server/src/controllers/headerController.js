// controllers/headerController.js
const HeaderConfig = require("../models/headerConfig");

// ================= Get Header Config =================
const getHeaderConfig = async (req, res) => {
  try {
    const config = await HeaderConfig.findOne().sort({ createdAt: -1 });
    if (!config)
      return res.status(404).json({ message: "No header config found" });
    res.json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Create Header Config =================
const createHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = new HeaderConfig(data);
    await config.save();
    res.status(201).json({ header: config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Update Header Config =================
const updateHeaderConfig = async (req, res) => {
  try {
    const data = req.body;
    const config = await HeaderConfig.findById(req.params.id);
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
const deleteHeaderConfig = async (req, res) => {
  try {
    const config = await HeaderConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ message: "Header config not found" });
    await config.remove();
    res.json({ message: "Header config deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getHeaderConfig,
  createHeaderConfig,
  updateHeaderConfig,
  deleteHeaderConfig,
};
