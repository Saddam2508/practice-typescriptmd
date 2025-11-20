// প্রয়োজনীয় মডিউল/প্যাকেজ গুলো ইমপোর্ট করা হচ্ছে
const createError = require("http-errors");
const { successResponse } = require("./responseController");
const {
  createCategory,
  getCategory,
  getSingleCategory,
  getUpdateCategory,
  deleteCategory,
} = require("../services/categoryService");

// ইউজার রেজিস্ট্রেশনের প্রসেসিং ফাংশন
const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const file = req.file;
    const newCategory = await createCategory(name, file);
    return successResponse(res, {
      statusCode: 201,
      message: "Category was created successfully",
      payload: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCategory = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchRegExp = new RegExp(search, "i");

    const filter = {
      $or: [{ name: { $regex: searchRegExp } }],
    };

    const categories = await getCategory(page, limit, filter);

    return successResponse(res, {
      statusCode: 200,
      message: "Category was fetched successfully",
      payload: {
        categories: categories.data,
        pagination: {
          totalPages: Math.ceil(categories.count / limit),
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage:
            page < Math.ceil(categories.count / limit) ? page + 1 : null,
          totalNumberOfcategories: categories.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetSingleCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getSingleCategory(slug);
    if (!category) {
      throw createError(404, "Category not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category was fetched successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const file = req.file;
    const updatedCategory = await getUpdateCategory(name, slug, file);

    if (!updatedCategory) {
      throw createError(404, "No category found with this slug");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await deleteCategory(slug);

    if (!result) {
      throw createError(404, "No category found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  handleGetCategory,
  handleGetSingleCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
