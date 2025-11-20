const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    ctaText: { type: String, default: "Shop Now" },
    ctaLink: { type: String, required: true },

    // Multiple products
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],

    // Multiple image URLs
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Promo = mongoose.models.Promo || mongoose.model("Promo", promoSchema);
module.exports = Promo;
