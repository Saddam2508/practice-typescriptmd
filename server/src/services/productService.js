// প্রয়োজনীয় মডিউল/প্যাকেজ গুলো ইমপোর্ট করা হচ্ছে
const createError = require("http-errors");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");
const ProductImage = require("../models/productImageModel");
const {
  publicIdWithoutExtensionFromUrl,
  deleteFileFromCloudinary,
} = require("../helper/cloudinaryHelper");

// ইউজার রেজিস্ট্রেশনের প্রসেসিং ফাংশন
const createProduct = async (productData) => {
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
    image,
    rating,
    totalRatings,
    codAvailable,
    returnDays,
    warranty,
    brand, // ✅ নতুন
    status, // ✅ নতুন
    variants, // ✅ নতুন
  } = productData;

  // একই নামের প্রোডাক্ট আছে কিনা চেক
  const productExists = await Product.exists({ name });
  if (productExists) {
    throw createError(409, "Product with this name already exists.");
  }

  // নতুন প্রোডাক্ট তৈরি
  const newProduct = await Product.create({
    name,
    slug: slugify(name),
    description,
    features,
    care,
    shippings,
    returns,
    price,
    quantity,
    shipping,
    image,
    category,
    sold,
    rating,
    totalRatings,
    codAvailable,
    returnDays,
    warranty,
    brand,
    status,
    variants,
  });

  return newProduct;
};

const getProduct = async (page = 1, limit = 4, filter = {}) => {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createAt: -1 });

  if (!products) throw createError(404, "No products found");

  const count = await Product.find(filter).countDocuments();

  return { products, count };
};

const getsingleProduct = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");

  if (!product) throw createError(404, "No product found");

  return product;
};

const deleteProduct = async ({ slug }) => {
  try {
    const existingProduct = await Product.findOne({ slug });

    if (!existingProduct) throw createError(404, "No product found with slug");

    // মূল ইমেজ ডিলিট
    if (existingProduct.image) {
      const publicId = publicIdWithoutExtensionFromUrl(existingProduct.image);
      await deleteFileFromCloudinary(
        "ecomerceMern/products",
        publicId,
        "Product"
      );
    }

    // গ্যালারি ইমেজ ডিলিট
    const galleryImages = await ProductImage.find({
      productId: existingProduct._id,
    });

    for (const img of galleryImages) {
      if (img.url) {
        const publicId = publicIdWithoutExtensionFromUrl(img.url);
        await deleteFileFromCloudinary(
          "ecomerceMern/gallery",
          publicId,
          "Gallery"
        );
      }
    }

    // ডাটাবেজ থেকে গ্যালারি রেকর্ড ডিলিট
    await ProductImage.deleteMany({ productId: existingProduct._id });

    // প্রোডাক্ট রিমুভ
    await Product.findOneAndDelete({ slug });
  } catch (error) {
    throw error;
  }
};

const updateProductBySlug = async (slug, req) => {
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      throw createError(404, "Product not found");
    }

    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    const allowedFields = [
      "name",
      "description",
      "features",
      "care",
      "shippings",
      "returns",
      "price",
      "sold",
      "quantity",
      "currencySymbol",
      "shipping",
      "rating",
      "totalRatings",
      "codAvailable",
      "returnDays",
      "warranty",
      "brand", // ✅ নতুন
      "status", // ✅ নতুন
      "variants", // ✅ নতুন
    ];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        // Variants যদি string হয়, তবে parse করতে হবে
        if (key === "variants" && typeof req.body[key] === "string") {
          try {
            updates[key] = JSON.parse(req.body[key]);
          } catch (err) {
            throw createError(400, "Invalid variants JSON format.");
          }
        } else {
          updates[key] = req.body[key];
        }

        // name update হলে slug ও আপডেট করো
        if (key === "name") {
          updates.slug = slugify(req.body[key]);
        }
      }
    }

    // ✅ Check safely for file before using its path
    if (req.file && req.file.path) {
      if (req.file.size > 1024 * 1024 * 2) {
        throw createError(400, "Image too large. It must be less than 2 MB");
      }

      const response = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecomerceMern/products",
      });

      updates.image = response.secure_url;

      // Purge old image
      if (product.image) {
        const publicId = await publicIdWithoutExtensionFromUrl(product.image);
        await deleteFileFromCloudinary(
          "ecomerceMern/products",
          publicId,
          "Product"
        );
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updates,
      updateOptions
    );

    if (!updatedProduct) {
      throw createError(500, "Product update failed");
    }

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getProduct,
  getsingleProduct,
  deleteProduct,
  updateProductBySlug,
};
