const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAdminAccessKey } = require("../secret");
const User = require("../models/userModel"); // ঠিক path দিয়ে

const isLoggedInAdmin = async (req, res, next) => {
  try {
    const accessAdminToken = req.cookies.accessAdminToken;
    if (!accessAdminToken) {
      throw createError(401, "Access token not found. Please Logged in");
    }

    const decoded = jwt.verify(accessAdminToken, jwtAdminAccessKey);
    if (!decoded) {
      throw createError(401, "Invalid access token. Please login again");
    }

    // ডাটাবেস থেকে ইউজার আইডি দিয়ে ইউজার নেওয়া
    const admin = await User.findById(decoded.id);

    if (!admin || !admin.isAdmin) {
      throw createError(403, "Access denied. Not an admin");
    }

    // req.user বা req.admin যেটা ভাল লাগে সেট করো
    req.user = admin;

    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedOutAdmin = (req, res, next) => {
  try {
    const accessAdminToken = req.cookies.accessAdminToken;
    if (accessAdminToken) {
      throw createError(400, "Admin is already Logged in");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmins = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw createError(
        403,
        "Forbidden. You must be an admin to access this resource"
      );
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedInAdmin, isLoggedOutAdmin, isAdmins };
