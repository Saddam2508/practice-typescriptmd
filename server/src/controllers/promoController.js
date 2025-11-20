const Promo = require("../models/promoModel");
const Product = require("../models/productModel");

// GET all promos (populate products)
const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find()
      .populate("products") // multiple products
      .sort({ createdAt: -1 });
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET single promo by ID
const getPromoById = async (req, res) => {
  try {
    const promo = await Promo.findById(req.params.id).populate("products");
    if (!promo) return res.status(404).json({ message: "Promo not found" });
    res.status(200).json(promo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// CREATE a new promo (multiple products + images)
const createPromo = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, imageProducts, images } =
      req.body;

    // Validate products
    const products = await Product.find({ _id: { $in: imageProducts } });
    if (products.length !== imageProducts.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    const newPromo = new Promo({
      title,
      subtitle,
      ctaText,
      ctaLink,
      products: products.map((p) => p._id),
      images,
    });

    await newPromo.save();
    res.status(201).json(newPromo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// UPDATE a promo by ID (multiple products + images)
const updatePromo = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, imageProducts, images } =
      req.body;

    // Validate products
    const products = await Product.find({ _id: { $in: imageProducts } });
    if (products.length !== imageProducts.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    const updatedPromo = await Promo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        ctaText,
        ctaLink,
        products: products.map((p) => p._id),
        images,
      },
      { new: true }
    ).populate("products");

    if (!updatedPromo)
      return res.status(404).json({ message: "Promo not found" });

    res.status(200).json(updatedPromo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// DELETE a promo by ID
const deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promo not found" });
    res.status(200).json({ message: "Promo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  getPromos,
  getPromoById,
  createPromo,
  updatePromo,
  deletePromo,
};
