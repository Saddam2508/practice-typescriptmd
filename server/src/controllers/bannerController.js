const { uploadSingleBuffer } = require("../config/cloudinary");
const createError = require("http-errors");
const Banner = require("../models/bannerModel");

// Create Banner
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive, position } = req.body;
    const file = req.file;

    if (!title) {
      throw createError(400, "Title is required");
    }

    if (!file || !file.buffer) {
      throw createError(400, "Image file is required");
    }

    if (file.size > 20 * 1024 * 1024) {
      throw createError(400, "File too large. Max 2MB");
    }

    // Cloudinary তে আপলোড
    const response = await uploadSingleBuffer(file.buffer, "site/banner");

    const bannerData = {
      title,
      image: response.secure_url,
      subtitle: subtitle || "",
      link: link || "",
      isActive: isActive !== undefined ? isActive : true,
      position: position ? Number(position) : 0,
      // productId: productId || null, // ✅ এখানে প্রডাক্ট সেভ হবে
    };

    const newBanner = await Banner.create(bannerData);
    res.status(201).json(newBanner);
  } catch (error) {
    console.error("Create Banner Error:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Failed to create banner" });
  }
};

// Get all banners (populate product info)
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ position: 1 });
    // .populate("productId", "name image price"); // ✅ product info আনবে
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update banner
const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive, position, productId } = req.body;
    const file = req.file;

    const updateData = {
      title,
      subtitle,
      link,
      isActive: isActive === "true" || isActive === true,
      position: position ? Number(position) : 0,
      productId: productId || null, // ✅ আপডেটেও product id থাকবে
    };

    // যদি নতুন ইমেজ আসে তাহলে আপলোড করব
    if (file && file.buffer) {
      if (file.size > 2 * 1024 * 1024) {
        throw createError(400, "File too large. Max 2MB");
      }

      const response = await uploadSingleBuffer(file.buffer, "site/banner");
      updateData.image = response.secure_url;
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("productId", "name image price");

    res.json(updated);
  } catch (err) {
    console.error("Update Banner Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    await Banner.findOneAndDelete(req.params.id);
    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
};
