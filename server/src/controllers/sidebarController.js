const SidebarConfig = require("../models/SidebarConfig");

// GET Sidebar Config
const getSidebarConfig = async (req, res) => {
  try {
    const config = await SidebarConfig.findOne();
    if (!config)
      return res
        .status(404)
        .json({ message: "Sidebar configuration not found" });

    const items = config.items || [];

    // Pagination removed: send all items
    const pagination = {
      totalItems: items.length,
      currentPage: 1,
      totalPages: 1,
      pageSize: items.length,
    };

    res.json({
      ...config.toObject(),
      items, // send all items
      pagination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sidebar config", error });
  }
};

// CREATE Sidebar Config
const createSidebarConfig = async (req, res) => {
  try {
    const config = new SidebarConfig(req.body);
    await config.save();
    res.status(201).json(config);
  } catch (error) {
    res.status(400).json({ message: "Failed to create sidebar config", error });
  }
};

// UPDATE Sidebar Config
const updateSidebarConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await SidebarConfig.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: "Failed to update sidebar config", error });
  }
};

// DELETE Sidebar Config
const deleteSidebarConfig = async (req, res) => {
  try {
    const { id } = req.params;
    await SidebarConfig.findByIdAndDelete(id);
    res.json({ message: "Sidebar config deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete sidebar config", error });
  }
};

module.exports = {
  getSidebarConfig,
  createSidebarConfig,
  updateSidebarConfig,
  deleteSidebarConfig,
};
