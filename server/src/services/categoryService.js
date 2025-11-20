const slugify = require("slugify");
const createError = require("http-errors");
const Category = require("../models/categoryModel");
const { uploadSingleBuffer } = require("../config/cloudinary");
const { deleteFileFromCloudinary } = require("../helper/cloudinaryHelper");

/**
 * Create a new category with image
 * @param {string} name
 * @param {file} file - Multer file object
 */
const createCategory = async (name, file) => {
  // Check if category already exists
  const exists = await Category.exists({ name });
  if (exists) throw createError(409, "Category with this name already exists");

  if (!file || !file.buffer)
    throw createError(400, "Category image is required");

  // Upload image to Cloudinary
  const result = await uploadSingleBuffer(
    file.buffer,
    "ecomerceMern/categories"
  );

  const newCategory = await Category.create({
    name,
    slug: slugify(name),
    image: result.secure_url,
  });

  return newCategory;
};

/**
 * Fetch categories with pagination & search
 */
const getCategory = async (page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit;

  const count = await Category.countDocuments(filter);

  const data = await Category.find(filter)
    .select("name slug image") // include image
    .skip(skip)
    .limit(limit)
    .lean();

  return { data, count };
};

/**
 * Fetch single category by slug
 */
const getSingleCategory = async (slug) => {
  const category = await Category.findOne({ slug })
    .select("name slug image")
    .lean();
  if (!category) throw createError(404, "Category not found");
  return category;
};

/**
 * Update category name and/or image
 */
const getUpdateCategory = async (slug, name, file) => {
  const category = await Category.findOne({ slug });
  if (!category) throw createError(404, "Category not found");

  const updates = { name, slug: slugify(name) };

  // If new image is provided, upload to Cloudinary
  if (file && file.buffer) {
    // Delete old image from Cloudinary
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0]; // simple extraction
      await deleteFileFromCloudinary(
        "ecomerceMern/categories",
        publicId,
        "Category"
      );
    }

    const result = await uploadSingleBuffer(
      file.buffer,
      "ecomerceMern/categories"
    );
    updates.image = result.secure_url;
  }

  const updatedCategory = await Category.findOneAndUpdate(
    { slug },
    { $set: updates },
    { new: true }
  );

  return updatedCategory;
};

/**
 * Delete category and image from Cloudinary
 */
const deleteCategory = async (slug) => {
  const category = await Category.findOneAndDelete({ slug });
  if (!category) throw createError(404, "Category not found");

  // Delete image from Cloudinary
  if (category.image) {
    const publicId = category.image.split("/").pop().split(".")[0];
    await deleteFileFromCloudinary(
      "ecomerceMern/categories",
      publicId,
      "Category"
    );
  }

  return category;
};

module.exports = {
  createCategory,
  getCategory,
  getSingleCategory,
  getUpdateCategory,
  deleteCategory,
};
