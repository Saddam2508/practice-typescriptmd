const mongoose = require("mongoose");

// ================= Submenu Schema =================
const SubmenuSchema = new mongoose.Schema({
  label: { type: String, required: true },
  icon: { type: String, default: "" }, // sidebar এ icon লাগতে পারে
  href: { type: String, default: "" },
  type: { type: String, enum: ["link", "submenu"], required: true },
  items: [{ type: mongoose.Schema.Types.Mixed }], // recursive nesting allowed
  textColor: { type: String, default: "#000000" },
  hoverTextColor: { type: String, default: "#ffffff" },
  hoverBackgroundColor: { type: String, default: "#f0f0f0" },
});

// ================= Menu Item Schema =================
const MenuItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  icon: { type: String, default: "" },
  href: { type: String, default: "" },
  type: { type: String, enum: ["link", "dropdown", "submenu"], required: true },
  items: [SubmenuSchema],
  textColor: { type: String, default: "#000000" },
  hoverTextColor: { type: String, default: "#ffffff" },
  hoverBackgroundColor: { type: String, default: "#e0e0e0" },
});

// ================= Sidebar Config Schema =================
const SidebarConfigSchema = new mongoose.Schema(
  {
    backgroundColor: { type: String, default: "#ffffff" },
    textColor: { type: String, default: "#000000" },
    hoverTextColor: { type: String, default: "#ffffff" },
    hoverBackgroundColor: { type: String, default: "#e0e0e0" },
    width: { type: String, default: "250px" }, // sidebar width
    position: { type: String, enum: ["left", "right"], default: "left" }, // sidebar position
    items: [MenuItemSchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SidebarConfig ||
  mongoose.model("SidebarConfig", SidebarConfigSchema);
