// প্রয়োজনীয় মডিউল/প্যাকেজ গুলো ইমপোর্ট করা হচ্ছে
const createError = require("http-errors");
const cloudinary = require("cloudinary").v2;
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const deleteImageHelper = require("../helper/deleteImageHelper");

const mongoose = require("mongoose");
const Product = require("../models/productModel");
const {
  createProduct,
  getProduct,
  getsingleProduct,
  deleteProduct,
  updateProductBySlug,
} = require("../services/productService");
const Category = require("../models/categoryModel");

// ইউজার রেজিস্ট্রেশনের প্রসেসিং ফাংশন
const handleCreateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      features,
      care,
      shippings,
      returns,
      price,
      sold,
      quantity,
      shipping,
      category,
      currencySymbol,
      rating,
      totalRatings,
      codAvailable,
      returnDays,
      warranty,
      brand, // ✅ newly added
      status, // ✅ newly added
      variants, // ✅ newly added (expecting array of objects)
    } = req.body;

    const image = req.file;
    if (!image || !image.path) {
      throw createError(400, "Image file is required");
    }

    if (image && image.size > 1024 * 1024 * 2) {
      throw createError(400, "File too large. It must be less than 2 MB");
    }

    const productData = {
      name,
      description,
      features,
      care,
      shippings,
      returns,
      price,
      sold,
      quantity,
      shipping,
      category,
      currencySymbol,
      rating,
      totalRatings,
      codAvailable,
      returnDays,
      warranty,
      brand,
      status,
    };

    // ✅ Parse variants if provided as JSON string
    if (variants) {
      try {
        productData.variants =
          typeof variants === "string" ? JSON.parse(variants) : variants;
      } catch (parseError) {
        throw createError(400, "Invalid variants format. Must be valid JSON.");
      }
    }

    if (image && image.path) {
      const response = await cloudinary.uploader.upload(image.path, {
        folder: "ecomerceMern/products",
      });

      productData.image = response.secure_url;
    }

    const newProduct = await createProduct(productData);

    return successResponse(res, {
      statusCode: 200,
      message: "Product was created successfully",
      payload: { newProduct },
    });
  } catch (error) {
    next(error);
  }
};

// ইউজার রেজিস্ট্রেশনের প্রসেসিং ফাংশন
const handleGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    // সার্চের জন্য রেগুলার এক্সপ্রেশন তৈরি করা হচ্ছে
    const searchRegExp = new RegExp(".*" + search + ".*");

    // অ্যাডমিন বাদ দিয়ে ইউজার ফিল্টার করা হচ্ছে
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        // { email: { $regex: searchRegExp } },
      ],
    };

    const productData = await getProduct(page, limit, filter);

    return successResponse(res, {
      statusCode: 200,
      message: "All Products fetched successfully",
      payload: {
        products: productData.products,
        pagination: {
          totalPages: Math.ceil(productData.count / limit),
          currentPage: page,
          previousPage: page - 1,
          nextPage: page + 1,
          totalNumberOfProduct: productData.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ইউজার রেজিস্ট্রেশনের প্রসেসিং ফাংশন
const handleGetSingleProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await getsingleProduct(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "returned single successfully",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};
// ইউজার রেজিস্ট্রেশনের প্রসেসিং ফাংশন
const handleDeleteProduct = async (req, res, next) => {
  try {
    const slug = req.params;
    await deleteProduct(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "Product delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

// নির্দিষ্ট ইউজার আপডেট করার ফাংশন
const handleUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params || req.body;

    // If variants sent in request, parse it to array of objects
    if (req.body.variants) {
      try {
        req.body.variants =
          typeof req.body.variants === "string"
            ? JSON.parse(req.body.variants)
            : req.body.variants;
      } catch (error) {
        throw createError(400, "Invalid variants format in update.");
      }
    }

    const updatedProduct = await updateProductBySlug(slug, req);

    return successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully",
      payload: { updatedProduct },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    next(error);
  }
};

const handleGetProductsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: category._id }).populate(
      "category"
    );

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const handleGetProductsByCategoryWise = async (req, res, next) => {
  console.log("✅ category-wise route hit");

  try {
    const categories = await Category.find();

    const categoryWiseProducts = {};

    for (const category of categories) {
      const products = await Product.find({ category: category._id });
      categoryWiseProducts[category.name] = products;
    }

    res.status(200).json({
      success: true,
      message: "Products fetched by category successfully",
      payload: categoryWiseProducts,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    next(error);
  }
};

const rateProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 0 || rating > 5) {
      console.log("Invalid rating value:", rating);
      return res.status(400).json({ error: "Invalid rating value" });
    }

    const product = await Product.findOne({ slug });

    if (!product) {
      console.log("Product not found:", slug);
      return res.status(404).json({ error: "Product not found" });
    }

    const totalRatings = product.totalRatings || 0;
    const currentRating = product.rating || 0;

    const newTotalRatings = totalRatings + 1;
    const newAvgRating =
      (currentRating * totalRatings + Number(rating)) / newTotalRatings;

    product.rating = newAvgRating;
    product.totalRatings = newTotalRatings;

    await product.save();

    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Rate product error:", err);
    res.status(500).json({ error: "Something went wrong while rating" });
  }
};

// 🏆 Best Selling Products
const handleGetBestSellingProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // কতগুলো প্রোডাক্ট দেখাবে
    const products = await Product.find()
      .sort({ sold: -1 }) // 🔥 sold অনুযায়ী descending order
      .limit(limit)
      .populate("category", "name");

    return successResponse(res, {
      statusCode: 200,
      message: "Best selling products fetched successfully",
      payload: products,
    });
  } catch (error) {
    next(error);
  }
};

// এক্সপোর্ট করে রাখা হলো যাতে অন্য জায়গা থেকে ফাংশন গুলো ব্যবহার করা যায়
module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetSingleProduct,
  handleDeleteProduct,
  handleUpdateProduct,
  handleGetProductsByCategory,
  handleGetProductsByCategoryWise,
  rateProduct,
  handleGetBestSellingProducts,
};
