const PublicMenu = require("../models/publicMenuModel");

// ✅ সব মেনু পাওয়া
const getPublicMenus = async (req, res) => {
  try {
    const { type } = req.query; // ?type=sidebar
    const query = type ? { type } : {};
    const menus = await PublicMenu.find(query).sort({ order: 1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ নতুন মেনু তৈরি
const createPublicMenu = async (req, res) => {
  try {
    const menu = new PublicMenu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ মেনু আপডেট
const updatePublicMenu = async (req, res) => {
  try {
    const menu = await PublicMenu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ মেনু ডিলিট
const deletePublicMenu = async (req, res) => {
  try {
    await PublicMenu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPublicMenus,
  createPublicMenu,
  updatePublicMenu,
  deletePublicMenu,
};
