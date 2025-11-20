const mongoose = require("mongoose");
const { Schema } = mongoose; // ✅ এই লাইন যুক্ত করতে হবে

const productImageSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", index: true },
  url: { type: String, required: true },
  publicId: String,
});

module.exports = mongoose.model("ProductImage", productImageSchema);
