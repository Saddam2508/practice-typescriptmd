// controllers/productImageController.js
const cloudinary = require("cloudinary").v2;
const ProductImage = require("../models/productImageModel");
const { uploadSingleBuffer } = require("../config/cloudinary");

const handleAddImage = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    // নতুন images upload করে MongoDB তে save
    await Promise.all(
      req.files.map(async (file) => {
        const uploaded = await uploadSingleBuffer(
          file.buffer,
          "product-gallery"
        );

        await ProductImage.create({
          product: productId,
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
        });
      })
    );

    // সব images fetch করে front-end এ দেখানোর জন্য return করা
    const allImages = await ProductImage.find({ product: productId });

    res.status(200).json({
      message: "New images added successfully",
      images: allImages, // সব images ফেরত পাঠাচ্ছে
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const handleDeleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const imgDoc = await ProductImage.findById(imageId);
    if (!imgDoc) return res.status(404).json({ message: "Image not found" });

    // Cloudinary থেকে ডিলিট
    if (imgDoc.publicId) {
      await cloudinary.uploader.destroy(imgDoc.publicId);
    }

    // MongoDB থেকে ডিলিট
    await imgDoc.deleteOne();

    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Optional: get all images of a product
const handleGetImagesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await ProductImage.find({ product: productId });

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hook or function to delete images when product deleted
// আপনি চাইলে এই মেথডটি productController থেকে কল করবেন
const handleDeleteImagesByProduct = async (productId) => {
  try {
    const images = await ProductImage.find({ product: productId });
    const deletePromises = images.map(async (img) => {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
      await img.deleteOne();
    });
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Failed to delete product images:", error.message);
  }
};

module.exports = {
  handleAddImage,
  handleDeleteImage,
  handleGetImagesByProduct,
  handleDeleteImagesByProduct,
};
