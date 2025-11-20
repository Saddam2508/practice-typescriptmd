const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      default: null,
    },
    type: {
      type: String, // কোনো fixed enum নেই
      default: "sidebar",
    },
    order: { type: Number, default: 0 },
    roles: [{ type: String, enum: ["admin", "manager", "user"] }],
    isActive: { type: Boolean, default: true },
    settings: {
      isCollapsible: { type: Boolean, default: false },
      showBadge: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
