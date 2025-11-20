const Menu = require("../models/menuModel");

// ✅ সব মেনু পাওয়া
const getMenus = async (req, res) => {
  try {
    const { type } = req.query; // ?type=sidebar
    const query = type ? { type } : {};
    const menus = await Menu.find(query).sort({ order: 1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ নতুন মেনু তৈরি
const createMenu = async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ মেনু আপডেট
const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ মেনু ডিলিট
const deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMenus, createMenu, updateMenu, deleteMenu };
